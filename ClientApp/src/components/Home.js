import React, { Component } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import authService from './api-authorization/AuthorizeService';
import AppContext from './AppContext';

const Home = () => {


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
    signalRHub.send("GetBoards");
  }

  const addBoardWithHub = async () => {
    signalRHub.send("CreateBoard",boardTitle);
  }

  const deleteBoardWithHub = async (boardId) => {
    signalRHub.send("DeleteBoard",boardId);
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
      <div>
        <h1>Boards with SignalR in a class in AppContext</h1>
        <Button onClick={getAuthToken}>Get Auth Token</Button>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Board Title</Form.Label>
            <Form.Control name="title" type="text" placeholder="Enter title" value={boardTitle} onChange={e => setBoardTitle(e.target.value)} />
          </Form.Group>
          <Button onClick={addBoardWithHub}>
            Add Board With SignalR Hub
          </Button>
        </Form>
        <Button onClick={getBoards}>Get Boards With SignalR Hub</Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>BoardId</th>
              <th>CreatedBy</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {
            boards.map(x => (
              <tr key={x.BoardId}>
                <td>{x.Title}</td>
                <td>{x.BoardId}</td>
                <td>{x.CreatedBy}</td>
                <td><Button onClick={() => deleteBoardWithHub(x.BoardId)}>Delete</Button></td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      </div>
  );
}

export default Home;