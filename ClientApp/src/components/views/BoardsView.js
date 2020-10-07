import React, { Component } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import authService from '../api-authorization/AuthorizeService';
import AppContext from '../AppContext';

export default () => {


  const [boards, setBoards] = React.useState([]);
  const [boardTitle, setBoardTitle] = React.useState("");
  const { signalRHub } = React.useContext(AppContext);

  const updateBoardTitle = (boardId, newTitle) => {
    const updatedBoards = boards.map((board) => {
      if (board.BoardId === boardId) {
        const updatedBoard = {
          ...board,
          Title: newTitle,
        };
 
        return updatedBoard;
      } else {
        return board;
      }
    });
    setBoards(updatedBoards);
  }
  const RefreshBoards = (boardsJson) => {
    console.log(boardsJson);
    setBoards(JSON.parse(boardsJson));
  }
  const sendSignalR = async (method, p1=null, p2=null, p3=null, p4=null) => {
    signalRHub.send(method,p1,p2,p3,p4)
    .then(() => console.log(`${method} succeeded`))
    .catch(err => { console.log(`${method} failed, ${err}. Attempting reconnect`);  signalRHub.restartHub();})    
  } 
  const getBoards = async () => { 
    sendSignalR("GetBoards");
  }
  const createBoard = async (boardTitle) => {
    sendSignalR("CreateBoard",boardTitle);
  }
  const deleteBoard = async (boardId) => {
    sendSignalR("DeleteBoard",boardId);
  }
  const renameBoard = async (boardId, newName) => {
    sendSignalR("RenameBoard",boardId, newName);
  }
  const titleKeyPress = async (event, boardId) => {
    if (event.key === "Enter") {
      //alert(`titleKeyPress boardId:${boardId} value:${event.target.value}`)
      await renameBoard(boardId, event.target.value);
    } 
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
      <h3>Your boards</h3>
      <Button onClick={() => createBoard("New board")}>Add Board</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>CreatedBy</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {
          boards.map(x => (
            <tr key={x.BoardId}>
              <td><input type="string" value={x.Title} onKeyDown={e => titleKeyPress(e, x.BoardId)} onChange={e => updateBoardTitle(x.BoardId, e.target.value)}></input></td>
              {/* <td><input type="string" value={x.Title}></input></td> */}
              <td>{x.CreatedBy}</td>
              <td>
                <Button onClick={() => deleteBoard(x.BoardId)}>Delete</Button>
              </td>
            </tr>
          ))
        }
        </tbody>
      </Table>
    </div>
  );
}