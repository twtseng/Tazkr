import React from 'react';
import {  Button, Card } from 'react-bootstrap'
import AppContext from '../AppContext';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import BoardCard from '../view-components/BoardCard';

const BoardsView = () => {


  const [boards, setBoards] = React.useState([]);
  const { signalRHub } = React.useContext(AppContext);

  const getBoards = async () => {
      const boardsData = await callBoardDataApi("BoardData/GetBoards","GET");
      setBoards(boardsData);
  }
  
  const createBoard = async () => {
    const boardsData = await callBoardDataApi("BoardData/CreateBoard","PUT", { Param1: "New Board" });
    getBoards();
  }

  React.useEffect(() => {
    getBoards();
  },[]);

  return (
      <Card className="d-flex flex-column">
        <Card.Header className="bg-secondary text-light"> 
          <Button onClick={createBoard}>Add Board</Button>
        </Card.Header>
        <Card.Body>
          <h3>Boards</h3>
          <div className="d-flex flex-wrap">
            {boards.map(x => 
              <BoardCard Title={x.title} BoardId={x.boardId} />
            )}
          </div>
        </Card.Body>
      </Card>
  );
}

export default BoardsView;