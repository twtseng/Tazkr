import React from 'react';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import authService from '../api-authorization/AuthorizeService';
import AppContext from '../AppContext';
import { useParams } from "react-router-dom";
import TaskCard from './TaskCard';

const BoardView = () => {
  const { hubGroupId } = useParams();

  const [board, setBoard] = React.useState({Columns:[]});
  const [columnTitle, setColumnTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const RefreshBoard = (boardJson) => {
    console.log("BoardView.RefreshBoard:"+boardJson);
    setBoard(JSON.parse(boardJson));
  }
 
  const getAuthToken = async () => {
      console.log("Getting auth token");
      const token = await authService.getAccessToken();
      await signalRHub.startHub(token);
      console.log("Got auth token");
  }
  const joinBoard = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "JoinBoard", Param1: "" }))
  }
  const getBoard = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "GetBoard", Param1: "" }))
  }
  const addColumn = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "AddColumn", Param1: columnTitle }))
  }
  const addCardToColumn = async (columnId) => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "AddCardToColumn", Param1: columnId }))
  }
  const renameCard = async (cardId, newTitle) => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "RenameCard", Param1: cardId, Param2: newTitle}))
  }

  React.useEffect(() => {
    authService.getAccessToken()
    .then((token) => {
        signalRHub.addMethod("BoardJson", RefreshBoard);
        signalRHub.startHub(token)
        .then(() => joinBoard())
        .then(() => getBoard())
    });
},[]);

  return (
      <Jumbotron className="d-flex flex-column">
        <h1>{board.Title} Board</h1>
        <Form>
          <Form.Group controlId="formBasicEmail" className="d-flex">
            <Button onClick={addColumn} className="col-2"><small>Add Column</small></Button>
            <Form.Control className="ml-3 col-3" name="title" type="text" placeholder="Enter column title" value={columnTitle} onChange={e => setColumnTitle(e.target.value)} />
          </Form.Group>
        </Form>
        <div className="d-flex flex-wrap">
          {board.Columns.sort((a,b) => { return a.Index - b.Index }).map(col => 
            <Card className='col-3 m-4' key={col.ColumnId}>
              <Card.Body>
                <Card.Title>{col.Title}</Card.Title>
                <Card.Text>Index:{col.Index}</Card.Text>
                <Button onClick={() => addCardToColumn(col.ColumnId)}><small>Add task</small></Button>
                {col.Cards.sort((a,b) => { return a.Index - b.Index }).map(t =>
                  <TaskCard key={t.CardId} Title={t.Title} CardId={t.CardId} Index={t.Index} renameCard={renameCard}/>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      </Jumbotron>
  );
}

export default BoardView;