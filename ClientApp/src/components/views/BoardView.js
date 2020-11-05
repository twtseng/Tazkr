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
    Columns:[], 
    CreatedBy:{UserName:""}, 
    BoardUsers:[],
    PermissionLevel:"Viewer"
  };
  const [board, setBoard] = React.useState(initialBoardState);
  const [boardTitle, setBoardTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const getBoard = async () => {
    const boardData = await callBoardDataApi(`BoardData/GetBoard/${boardId}`,"GET");
    boardData.Columns.sort((a,b) => { return a.Index - b.Index });
    boardData.Columns.forEach(col => {
      col.Cards.sort((a,b) => { return a.Index - b.Index });
    });
    setBoard(boardData);
    setBoardTitle(boardData.Title);
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
            {board.Columns.map(col => 
              <BoardColumn key={col.UpdateHashCode} HashCode={col.UpdateHashCode} Title={col.Title} Index={col.Index} ColumnId={col.Id} getBoard={getBoard}>
                  {col.Cards.map((t, index) =>
                    <TaskCard 
                      key={t.UpdateHashCode}
                      HashCode={t.UpdateHashCode}
                      Title={t.Title} 
                      CardId={t.Id} 
                      Index={index} 
                      Description={t.Description} 
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
            <small>{board.CreatedBy.UserName}</small>
          </Card.Body> 
        </Card>
        <UsersCard board={board} getBoard={getBoard} />
      </Card>
      </div>
    </DragDropContext>  
  );
}

export default BoardView;