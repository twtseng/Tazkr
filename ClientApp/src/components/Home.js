import React, { Component } from 'react';
import { Jumbotron, Button, Card, Table, Form } from 'react-bootstrap'
import authService from './api-authorization/AuthorizeService';
import AppContext from './AppContext';

const Home = () => {


  const [boards, setBoards] = React.useState([]);
  const [boardTitle, setBoardTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const RefreshBoardsWithContents = (boardsJson) => {
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
    signalRHub.callAction("", JSON.stringify({ Method: "GetBoardsWithContents", Param1: "" }))
  }
  const createBoard = async () => {
    signalRHub.callAction("", JSON.stringify({ Method: "CreateBoard", Param1: boardTitle }))
  }


  React.useEffect(() => {
    authService.getAccessToken()
    .then((token) => {
        signalRHub.addMethod("RefreshBoardsWithContents", RefreshBoardsWithContents);
        signalRHub.startHub(token)
        .then(() => getBoards())
    });
},[]);
  return (
      <Jumbotron className="d-flex flex-column">
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Board Title</Form.Label>
            <Form.Control name="title" type="text" placeholder="Enter title" value={boardTitle} onChange={e => setBoardTitle(e.target.value)} />
          </Form.Group>
          <Button onClick={createBoard}>
            Add Board
          </Button>
        </Form>
        <h1>Boards</h1>
        <div className="d-flex flex-wrap">
          {boards.map(x => 
            <Card  className='col-3 m-4' key={x.HubGroupId}>
              <Card.Body>
                <Card.Title>{x.Title}</Card.Title>
                <Card.Text>{x.BoardId}</Card.Text>
                <Card.Text>{x.CreatedBy}</Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      </Jumbotron>
  );
}

export default Home;