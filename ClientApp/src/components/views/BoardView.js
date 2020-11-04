import React from 'react';
import { Card, Form, Dropdown } from 'react-bootstrap'
import AppContext from '../AppContext';
import { useParams, useHistory } from "react-router-dom";
import {DragDropContext} from 'react-beautiful-dnd';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import dragEndHandler from '../dragdrop/BoardViewDragEndHandler';
import TaskCard from '../view-components/TaskCard';
import BoardColumn from '../view-components/BoardColumn';
import UsersCard from '../view-components/UsersCard';

const BoardView = () => {
  const { boardId } = useParams();

  const [board, setBoard] = React.useState({columns:[], createdBy:{userName:""}, boardUsers:[]});
  const [boardTitle, setBoardTitle] = React.useState("")
  const [titleReadOnly, setTitleReadOnly] = React.useState(true)
  const { signalRHub } = React.useContext(AppContext);
  const history = useHistory();

  const RefreshBoard = (inputBoard) => {
    // Sort the board items before display
    inputBoard.columns.sort((a,b) => { return a.index - b.index });
    inputBoard.columns.forEach(col => {
      col.cards.sort((a,b) => { return a.index - b.index });
    });
    setBoard(inputBoard);
    setBoardTitle(inputBoard.title);
  }

  const getBoard = async () => {
    const boardData = await callBoardDataApi(`BoardData/GetBoard/${boardId}`,"GET");
    RefreshBoard(boardData);
  }

  const addColumn = async () => {
    await callBoardDataApi(`BoardData/AddColumnToBoard`,"PATCH",{ Param1: boardId, Param2: "New Column"});
    getBoard();
  }
  const deleteBoard = async () => {
    callBoardDataApi(`BoardData/DeleteBoard`,"DELETE",{ Param1: boardId })
    .then(() => history.push("/boards"))
    .catch(err => alert(err))
  }
  const renameBoard = async () => {
    if (boardTitle !== board.title) {
      callBoardDataApi(`BoardData/RenameBoard`,"PATCH",{ Param1: boardId, Param2: boardTitle })
      .then(() => console.log("renameBoard completed"))
      .catch((err) => console.log(`renameBoard failed, err = ${err}`));
    }
    setTitleReadOnly(true);
  }
  const handleBoardTitleKeyPress = (event) => {
    if(event.key === 'Enter'){
      renameBoard();
    }
  }

  React.useEffect(() => {
    getBoard();
  },[]);
  
  return (
    <DragDropContext onDragEnd={(result) => dragEndHandler(result, board, setBoard)}>
      <div className="col-12 d-flex h-100">
      <div className="col-10 h-100"> 
        <Card className="d-flex flex-column bg-light h-100">
          <Card.Header className="bg-secondary text-light">   
          <div className="TitleRow d-flex justify-content-between">
            
            <div className="TitleEdit col-6">
              <h5 
                className="editable"
                onClick={() => setTitleReadOnly(false)} style={titleReadOnly ? {} : {display:"none"}}>
                  {board.title === "" ? "<title blank>" : boardTitle}
              </h5>
              <Form.Control 
                className="input-lg col-12 font-weight-bold" 
                name="taskTitle" 
                type="text" 
                value={boardTitle} 
                onChange={e => setBoardTitle(e.target.value)}
                onKeyPress={handleBoardTitleKeyPress}
                onMouseLeave={renameBoard}
                size="sm"
                style={titleReadOnly ? {display:"none"} : {}}
                />
            </div>
            <Dropdown>
                <Dropdown.Toggle className="text-light" variant="muted">
                    <small>Board actions</small>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={addColumn}><small>Add Column</small></Dropdown.Item>
                  <Dropdown.Item onClick={deleteBoard}><small>Delete Board</small></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>
          </Card.Header>
          <Card.Body
            className="d-flex flex-nowrap bg-light scrolling-wrapper" 
            >
            {board.columns.map(col => 
              <BoardColumn key={col.columnId} Title={col.title} Index={col.index} ColumnId={col.columnId} getBoard={getBoard}>
                  {col.cards.map((t, index) =>
                    <TaskCard 
                      key={t.cardId+t.title} 
                      Title={t.title} 
                      CardId={t.cardId} 
                      Index={index} 
                      Description={t.description} 
                      getBoard={getBoard}/>
                  )}
              </BoardColumn>
            )}
          </Card.Body> 
        </Card>
      </div>
      <Card className="col-2 bg-light p-2">
        <Card className="mb-2">
          <Card.Header className="bg-secondary text-light">Owner</Card.Header>
          <Card.Body>
            <small>{board.createdBy.userName}</small>
          </Card.Body> 
        </Card>
        <UsersCard board={board} getBoard={getBoard} />
      </Card>
      </div>
    </DragDropContext>  
  );
}

export default BoardView;