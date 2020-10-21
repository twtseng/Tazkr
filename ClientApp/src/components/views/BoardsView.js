import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import authService from '../api-authorization/AuthorizeService';
import AppContext from '../AppContext';

const BoardsView = () => {


  const [boards, setBoards] = React.useState([]);
  const [boardTitle, setBoardTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const RefreshBoards = (boardsJson) => {
    console.log(boardsJson);
    setBoards(JSON.parse(boardsJson));
  }
 
  const getAuthToken = async () => {
      console.log("Getting auth token");
      const token = await authService.getAccessToken();
      await signalRHub.startHub(token);
      console.log("Got auth token");
  }

  const getBoards = async () => {
    signalRHub.callAction("", JSON.stringify({ Method: "GetBoards", Param1: "" }))
  }
  const createBoard = async () => {
    signalRHub.callAction("", JSON.stringify({ Method: "CreateBoard", Param1: boardTitle }));
    setBoardTitle("");
  }


  React.useEffect(() => {
    authService.getAccessToken()
    .then((token) => {
        signalRHub.addMethod("RefreshBoards", RefreshBoards);
        signalRHub.startHub(token)
        .then(() => getBoards())
    });
},[]);

  return (
      <Jumbotron className="d-flex flex-column">
        <Form>
          <Form.Group controlId="formBasicEmail" className="d-flex">
            <Button onClick={createBoard} className="col-2">Add Board</Button>
            <Form.Control className="ml-3 col-3" name="title" type="text" placeholder="Enter board title" value={boardTitle} onChange={e => setBoardTitle(e.target.value)} />
          </Form.Group>
        </Form>
        <h1>Boards</h1>
        <div className="d-flex flex-wrap">
          {boards.map(x => 
            <Card  className='col-3 m-4' key={x.HubGroupId}>
              <Card.Body>
                <Card.Title>{x.Title}</Card.Title>
                <Card.Text><small>BoardId: {x.BoardId}</small></Card.Text>
                <Card.Text><small>CreatedBy: {x.CreatedBy}</small></Card.Text>
                <Card.Text><small>HubGroupId: {x.HubGroupId}</small></Card.Text>
                <Link to={`/board/${x.HubGroupId}`}>Go to board</Link>
              </Card.Body>
            </Card>
          )}
        </div>
      </Jumbotron>
  );
}

export default BoardsView;