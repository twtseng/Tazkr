import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import authService from '../api-authorization/AuthorizeService';
import AppContext from '../AppContext';
import callBoardDataApi from '../BoardDataApi';

const BoardsView = () => {


  const [boards, setBoards] = React.useState([]);
  const [boardTitle, setBoardTitle] = React.useState("");
  const [currentUsers, setCurrentUsers] = React.useState([]);
  const { signalRHub } = React.useContext(AppContext);

  const RefreshBoards = (boardsJson) => {
    const inputBoards = JSON.parse(boardsJson);
    inputBoards.sort(x => x.Title);  
    setBoards(inputBoards);
  }
  const RefreshCurrentUsers = (usersJson) => {
    const inputUsers = JSON.parse(usersJson);
    setCurrentUsers(inputUsers);
  } 
  const getAuthToken = async () => {
      console.log("Getting auth token");
      const token = await authService.getAccessToken();
      await signalRHub.startHub(token);
      console.log("Got auth token");
  }

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
        <h3>Current users</h3>
        <div className="currentUsers">
        <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">UserName</th>
                <th scope="col">LastSeen</th>
              </tr>
            </thead>
            <tbody>
            {currentUsers.map(x => 
              
                  <tr>
                    <td>{x.UserName}</td>
                    <td>{x.LastRequestTime}</td>
                  </tr>

            )}  
            </tbody>
          </table>          
        </div>
      </Jumbotron>
  );
}

export default BoardsView;