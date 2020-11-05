import React from 'react';
import { Card, Form, Dropdown } from 'react-bootstrap'
import AppContext from '../AppContext';
import { useParams } from "react-router-dom";
import {DragDropContext} from 'react-beautiful-dnd';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import dragEndHandler from '../dragdrop/BoardViewDragEndHandler';
import TaskCard from '../view-components/TaskCard';
import BoardColumn from '../view-components/BoardColumn';
import UsersCard from '../view-components/UsersCard';
import BoardStatusBar from '../view-components/BoardStatusBar';

const BoardView = () => {
  const { boardId } = useParams();
  const initialBoardState = {
    columns:[], 
    createdBy:{userName:""}, 
    boardUsers:[],
    permissionLevel:"Viewer"
  };
  const [board, setBoard] = React.useState(initialBoardState);
  const [boardTitle, setBoardTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const getBoard = async () => {
    const boardData = await callBoardDataApi(`BoardData/GetBoard/${boardId}`,"GET");
    boardData.columns.sort((a,b) => { return a.index - b.index });
    boardData.columns.forEach(col => {
      col.cards.sort((a,b) => { return a.index - b.index });
    });
    setBoard(boardData);
    setBoardTitle(boardData.title);
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
            <BoardStatusBar board={board} getBoard={getBoard} boardTitle={boardTitle} setBoardTitle={setBoardTitle} />
          </Card.Header>
          <Card.Body
            className="d-flex flex-nowrap bg-light scrolling-wrapper">
            {board.columns.map(col => 
              <BoardColumn key={col.updateHashCode} HashCode={col.updateHashCode} Title={col.title} Index={col.index} ColumnId={col.id} getBoard={getBoard}>
                  {col.cards.map((t, index) =>
                    <TaskCard 
                      key={t.updateHashCode}
                      HashCode={t.updateHashCode}
                      Title={t.title} 
                      CardId={t.id} 
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
          <Card.Header className="bg-secondary text-light">BoardTitle: {boardTitle}</Card.Header>
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