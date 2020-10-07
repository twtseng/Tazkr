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
    signalRHub.send("GetBoards")
    .then(() => console.log(`getBoards succeeded`))
    .catch(err => { console.log(`getBoards failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})
  }

  const addBoardWithHub = async () => {
    signalRHub.send("CreateBoard",boardTitle)
    .then(() => console.log(`addBoardWithHub succeeded`))
    .catch(err => { console.log(`addBoardWithHub failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})
  }

  const deleteBoardWithHub = async (boardId) => {
    signalRHub.send("DeleteBoard",boardId)
    .then(() => console.log(`deleteBoardWithHub succeeded`))
    .catch(err => { console.log(`deleteBoardWithHub failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})
  }
  const addColumnToBoard = async (boardId) => {
    signalRHub.send("AddColumnToBoard",boardId)
    .then(() => console.log(`AddColumnToBoard succeeded`))
    .catch(err => { console.log(`AddColumnToBoard failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})
  }
  const deleteColumnWithHub = async (columnId) => {
    signalRHub.send("DeleteColumn",columnId)
    .then(() => console.log(`deleteColumnWithHub succeeded`))
    .catch(err => { console.log(`deleteColumnWithHub failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})
  }
  const addCardToColumn = async (columnId) => {
    signalRHub.send("AddCardToColumn",columnId)
    .then(() => console.log(`addCardToColumn succeeded`))
    .catch(err => { console.log(`addCardToColumn failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})
  }
  const deleteCard = async (cardId) => {
    signalRHub.send("DeleteCard",cardId)
    .then(() => console.log(`deleteCard succeeded`))
    .catch(err => { console.log(`deleteCard failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})
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
              <th>Columns</th>
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
                <td>
                  <ul>
                  {
                    x.Columns.map(col => (
                      <li key={col.ColumnId}>{col.Title}
                        <Button onClick={() => deleteColumnWithHub(col.ColumnId)}>Delete</Button>
                        <Button onClick={() => addCardToColumn(col.ColumnId)}>Add Card</Button>
                        <ul>
                          {
                            col.Cards.map(card => (
                              <li key={card.CardId}>{card.Title}
                              <Button onClick={() => deleteCard(card.CardId)}>Delete Card</Button>
                              </li>
                            ))
                          }
                        </ul>
                      </li>
                    ))
                  }
                  </ul>
                </td>
                <td>{x.CreatedBy}</td>
                <td>
                  <Button onClick={() => deleteBoardWithHub(x.BoardId)}>Delete</Button>
                  <Button onClick={() => addColumnToBoard(x.BoardId)}>Add Column</Button>
                </td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      </div>
  );
}

export default Home;