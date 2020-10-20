import React from 'react';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import authService from '../api-authorization/AuthorizeService';
import AppContext from '../AppContext';
import { useParams } from "react-router-dom";

const BoardView = () => {
  const { hubGroupId } = useParams();

  const [board, setBoard] = React.useState([]);
  const [columnTitle, setColumnTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const RefreshBoard = (boardJson) => {
    console.log(boardJson);
    setBoard(JSON.parse(boardJson));
  }
 
  const getAuthToken = async () => {
      console.log("Getting auth token");
      const token = await authService.getAccessToken();
      await signalRHub.startHub(token);
      console.log("Got auth token");
  }

  const getBoard = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "GetBoard", Param1: "" }))
  }
  const createColumn = async () => {
    signalRHub.callAction(hubGroupId, JSON.stringify({ Method: "CreateColumn", Param1: columnTitle }))
  }


  React.useEffect(() => {
    authService.getAccessToken()
    .then((token) => {
        signalRHub.addMethod("BoardJson", RefreshBoard);
        signalRHub.startHub(token)
        .then(() => getBoard())
    });
},[]);

  return (
      <Jumbotron className="d-flex flex-column">
        <Form>
          <Form.Group controlId="formBasicEmail" className="d-flex">
            <Button onClick={createColumn} className="col-2">Add Column</Button>
            <Form.Control className="ml-3 col-3" name="title" type="text" placeholder="Enter column title" value={columnTitle} onChange={e => setColumnTitle(e.target.value)} />
          </Form.Group>
        </Form>
        <h1>Board {board.Name} Id: {board.BoardId} HubGroup: {board.HubGroupId}</h1>
        <div className="d-flex flex-wrap">
          {/* {board.map(x => 
            <Card  className='col-3 m-4' key={x.HubGroupId}>
              <Card.Body>
                <Card.Title>{x.Title}</Card.Title>
                <Card.Text><small>BoardId: {x.BoardId}</small></Card.Text>
                <Card.Text><small>CreatedBy: {x.CreatedBy}</small></Card.Text>
                <Card.Text><small>HubGroupId: {x.HubGroupId}</small></Card.Text>
              </Card.Body>
            </Card>
          )} */}
        </div>
      </Jumbotron>
  );
}

export default BoardView;