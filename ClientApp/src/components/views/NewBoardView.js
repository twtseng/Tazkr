import React from 'react';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import authService from '../api-authorization/AuthorizeService';
import AppContext from '../AppContext';
import { useParams } from "react-router-dom";
import TaskCard from './NewTaskCard';
import BoardColumn from './NewBoardColumn';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import styled from 'styled-components'

const DragContainer = styled.div`
    border-radius: 10px;
    background-color: ${props => (props.isDragging ? "darkgray" : "white")};
    display: inline-block
`

const BoardView = () => {
  const { hubGroupId } = useParams();

  const [board, setBoard] = React.useState({Columns:[]});
  const [columnTitle, setColumnTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const RefreshBoard = (boardJson) => {
    const inputBoard = JSON.parse(boardJson);
    inputBoard.Columns.sort((a,b) => { return a.Index - b.Index });
    inputBoard.Columns.forEach(col => {
      col.Cards.sort((a,b) => { return a.Index - b.Index });
    });
    setBoard(inputBoard);
  }
 
  const getAuthToken = async () => {
      const token = await authService.getAccessToken();
      await signalRHub.startHub(token);
  }
  const joinBoard = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "JoinBoard", Param1: "" }))
  }
  const getBoard = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "GetBoard", Param1: "" }))
  }
  const addColumn = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "AddColumn", Param1: columnTitle }));
    setColumnTitle("");
  }
  const addCardToColumn = async (columnId) => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "AddCardToColumn", Param1: columnId }))
  }
  const renameCard = async (cardId, newTitle) => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "RenameCard", Param1: cardId, Param2: newTitle}))
  }
  const renameColumn = async (columnId, newTitle) => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "RenameColumn", Param1: columnId, Param2: newTitle}))
  }
  const moveCardToColumnAtIndex = async (taskId, columnId, index) => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "MoveCardToColumnAtIndex", Param1: taskId, Param2: columnId, Param3: index}))
  }

  React.useEffect(() => {
    authService.getAccessToken()
    .then((token) => {
        signalRHub.addMethod("BoardJson", RefreshBoard);
        signalRHub.startHub(token)
        .then(() => joinBoard())
        .then(() => getBoard())
    });
  },[]);

  const findCardById = (inputBoard, cardId) => {
    for (let colIndex = 0; colIndex < inputBoard.Columns.length; ++colIndex) {
        const column = inputBoard.Columns[colIndex];
        for (let cardIndex = 0; cardIndex < column.Cards.length; ++cardIndex) {
            if (column.Cards[cardIndex].CardId === cardId) {
                return column.Cards[cardIndex];
            }
        }
    }
    return null;
  }
  const findColumnById = (inputBoard, columnId) => {
      for (let colIndex = 0; colIndex < inputBoard.Columns.length; ++colIndex) {
          if (inputBoard.Columns[colIndex].ColumnId === columnId) {
              return inputBoard.Columns[colIndex];
          }
      }
      return null;
  }
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    // Dropping card onto a column
    if (result.type == "ColumnDroppable") {
      // Exit if No destination
      if (!destination) {
          return;
      }
      // Exit if Dropping on same place
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return;
      }
      const startColumn = findColumnById(board, source.droppableId);
      const finishColumn = findColumnById(board, destination.droppableId);
      const card = findCardById(board, draggableId);
  
      if (source.droppableId === destination.droppableId) {
          // Reordering task on same column
          const newBoard = {...board}  
          const newCards = [...startColumn.Cards];
          newCards.splice(source.index, 1);
          newCards.splice(destination.index, 0, card);
          const updateColumn = findColumnById(newBoard, destination.droppableId);
          updateColumn.Cards = newCards;
          setBoard(newBoard);
      } else { 
          // Moving task to new column
          const newBoard = {...board} 
          const startColumnCards = [...startColumn.Cards];
          startColumnCards.splice(source.index, 1);
          const newStartColumn = findColumnById(newBoard, source.droppableId);
          newStartColumn.Cards = startColumnCards;
          const finishColumnCards = [...finishColumn.Cards];
          finishColumnCards.splice(destination.index, 0, card);
          const newFinishColumn = findColumnById(newBoard, destination.droppableId);
          newFinishColumn.Cards = finishColumnCards;
          setBoard(newBoard);
      }
      moveCardToColumnAtIndex(draggableId, destination.droppableId, destination.index);
    } else {
      // Moving columns to different order
      const newBoard = {...board} 
      newBoard.Columns = reorder(newBoard.Columns, source.index, destination.index);
      setBoard(newBoard);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Jumbotron className="d-flex flex-column">
        <h1>{board.Title} Board</h1>
        <Form>
          <Form.Group controlId="formBasicEmail" className="d-flex">
            <Button onClick={addColumn} className="col-2"><small>Add Column</small></Button>
            <Form.Control className="ml-3 col-3" name="title" type="text" placeholder="Enter column title" value={columnTitle} onChange={e => setColumnTitle(e.target.value)} />
          </Form.Group>
        </Form>
        <Droppable droppableId="droppable" type="BoardDroppable">
          {(provided, snapshot) => (
            <div className="d-flex flex-nowrap" style={{overflowX:"auto"}}
              ref={provided.innerRef}
            >
              {board.Columns.map((col,index) => 
                <Draggable key={col.ColumnId} draggableId={col.ColumnId} index={index}>
                {(provided, snapshot) => (
                  <DragContainer
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                  >
                    <BoardColumn className='col-3' key={col.ColumnId} Title={col.Title} Index={col.Index} ColumnId={col.ColumnId} addCardToColumn={addCardToColumn} renameColumn={renameColumn}>
                        {col.Cards.map((t, index) =>
                          <TaskCard key={t.CardId} Title={t.Title} CardId={t.CardId} Index={index} renameCard={renameCard}/>
                        )}
                    </BoardColumn>
                  </DragContainer>
                )}
                </Draggable>
              )}
              {provided.placeholder}
            </div>
          )}
          
        </Droppable>
      </Jumbotron>
    </DragDropContext>  
  );
}

export default BoardView;