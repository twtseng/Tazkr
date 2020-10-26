import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import AppContext from '../AppContext';
import callBoardDataApi from '../api-board-data/BoardDataApi'

const BoardsView = () => {


  const [boards, setBoards] = React.useState([]);
  const [boardTitle, setBoardTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const getBoards = async () => {
      const boardsData = await callBoardDataApi("BoardData/GetBoards","GET");
      setBoards(boardsData);
  }
  
  const createBoard = async () => {
    signalRHub.callAction("", JSON.stringify({ Method: "CreateBoard", Param1: boardTitle }));
    setBoardTitle("");
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
            <Card className='col-2 m-4' key={x.boardId}>
              <Card.Body>
                <Card.Title>{x.title == "" ? "<title blank>" : x.title}</Card.Title>
                <Link to={`/board/${x.boardId}`}>Go to board</Link>
              </Card.Body>
            </Card>
          )}
        </div>
      </Jumbotron>
  );
}

export default BoardsView;