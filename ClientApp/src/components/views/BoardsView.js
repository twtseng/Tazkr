import React from 'react';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import AppContext from '../AppContext';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import BoardCard from '../view-components/BoardCard';

const BoardsView = () => {


  const [boards, setBoards] = React.useState([]);
  const [boardTitle, setBoardTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const getBoards = async () => {
      const boardsData = await callBoardDataApi("BoardData/GetBoards","GET");
      setBoards(boardsData);
  }
  
  const createBoard = async () => {
    const boardsData = await callBoardDataApi("BoardData/CreateBoard","PUT", { Param1: boardTitle });
    setBoardTitle("");
    getBoards();
  }

  React.useEffect(() => {
    getBoards();
  },[]);

  return (
      <Jumbotron className="d-flex flex-column">
        <Form>
          <Form.Group controlId="formBasicEmail" className="d-flex">
            <Button onClick={createBoard} className="col-2">Add Board</Button>
            <Form.Control className="ml-3 col-3" name="title" type="text" placeholder="Enter board title" value={boardTitle} onChange={e => setBoardTitle(e.target.value)} />
          </Form.Group>
        </Form>
        <h3>Boards</h3>
        <div className="d-flex flex-wrap">
          {boards.map(x => 
            <BoardCard Title={x.title} BoardId={x.boardId} />
          )}
        </div>
      </Jumbotron>
  );
}

export default BoardsView;