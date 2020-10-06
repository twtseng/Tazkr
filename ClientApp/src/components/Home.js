import React, { Component } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import authService from './api-authorization/AuthorizeService';
import * as signalR from '@microsoft/signalr';

const Home = () => {


  const [boards, setBoards] = React.useState([]);
  const [authToken, setAuthToken] = React.useState("");
  const [boardTitle, setBoardTitle] = React.useState("");

  const RefreshBoards = (boardsJson) => {
    console.log(boardsJson);
    setBoards(JSON.parse(boardsJson));
  }
  const [signalRHub, setSignalRHub] = React.useState([]);
  React.useEffect(() => {
      authService.getAccessToken()
      .then((token) => {
          setAuthToken(token);
          const hub = new signalR.HubConnectionBuilder()
          .withUrl("/hub")
          .configureLogging(signalR.LogLevel.Information)  
          .build();

          hub.on("RefreshBoards", RefreshBoards);

          // Starts the SignalR connection
          hub.start();
          setSignalRHub(hub);
      });
  },[]);
  const getAuthToken = async () => {
    if (authToken === "") {
      console.log("Getting auth token because it is equal to space");
      const token = await authService.getAccessToken();
      setAuthToken(token);
    } else {
      console.log(`NOT Getting auth token because it is equal to ${authToken}`);
    }
  }
  const ConnectSignalR = async () => {
    const token = await authService.getAccessToken();
    signalRHub.Connect(token);
  }
  const getBoards = async () => {
    signalRHub.invoke("GetBoards", authToken,"")
    .then(() => console.log("getBoards succeeded"))
    .catch(err => console.log(`getBoards failed, ${err}`))
  }

  const addBoardWithHub = async () => {
    signalRHub.invoke("CreateBoard", authToken,boardTitle)
    .then(() => console.log("CreateBoard succeeded"))
    .catch(err => console.log(`CreateBoard failed, ${err}`));
  }

  const deleteBoardWithHub = async (boardId) => {
    signalRHub.invoke("DeleteBoard", authToken,boardId)
    .then(() => console.log("deleteBoardWithHub succeeded"))
    .catch(err => console.log(`deleteBoardWithHub failed, ${err}`));
  }
  return (
      <div>
        <h1>Boards with SignalR embedded on page</h1>
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