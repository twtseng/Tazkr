import React from 'react';
import {  Button, Card } from 'react-bootstrap'
import AppContext from '../AppContext';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import { HubMethod } from '../api-board-data/SignalRHub';
import BoardCard from '../view-components/BoardCard';
import { Board, User } from '../view-components/TazkrObjects';
import authService from '../api-authorization/AuthorizeService';

const BoardsView = () => {

  const [boards, setBoards] = React.useState([]);
  const signalRHub = React.useContext(AppContext);
  const getBoards = async () => {
    const boardsData = await BoardDataApi.getBoards();
    boardsData.sort((a:Board,b:Board) => { return (new Date(a.CreatedDateUTC)) > (new Date(b.CreatedDateUTC)) ? 1 : -1 });
    setBoards(boardsData);
  }
  const createBoard = async () => {
    const boardsData = await BoardDataApi.createBoard("New Board");
    getBoards();
  }
  const [boardUsers, setBoardUsers] = React.useState([]);
  const updateAppUsers: HubMethod = (arg1:any, arg2: any, arg3: any, arg4:any )=> {
    getAppUsers();
  }
  const getAppUsers = async () => {
    const users = await BoardDataApi.getUsers();
    setBoardUsers(users);
  }
  React.useEffect(() => {
    signalRHub.setMethod("UpdateAppUsers", updateAppUsers);
    getBoards();
    getAppUsers();
  },[]);
  return (
    <div className="col-12 d-flex">
      <div className="col-10 h-100">
        <Card className="d-flex flex-column bg-dark h-100">
          <Card.Body>
            <Card className="d-flex flex-column bg-info h-100 mb-4">
              <Card.Header className="bg-secondary text-light d-flex justify-content-between"> 
                <h6 className="mr-4">Owned by you</h6>
                <Button onClick={createBoard}>Add a Board</Button>
              </Card.Header>
              <div className="d-flex flex-wrap justify-content-start">
                {boards.map((x: Board) =>
                  x.PermissionLevel === "Owner"
                  ? <BoardCard key={x.UpdateHashCode} Title={x.Title} BoardId={x.Id} CreatedBy={x.CreatedBy} getBoards={getBoards} IsPublic={x.IsPubliclyVisible} />
                  : null
                  )}
              </div>
            </Card>
            <Card className="d-flex flex-column bg-info h-100 mb-4">
              <Card.Header className="bg-secondary text-light"> 
                <h6>Editable by you</h6>
              </Card.Header>
              <div className="d-flex flex-wrap justify-content-start">
                {boards.map((x: Board) =>
                  x.PermissionLevel === "User"
                  ? <BoardCard key={x.UpdateHashCode} Title={x.Title} BoardId={x.Id} CreatedBy={x.CreatedBy} getBoards={getBoards} IsPublic={x.IsPubliclyVisible} />
                  : null
                  )}
              </div>
            </Card>
            <Card className="d-flex flex-column bg-info h-100 mb-4">
              <Card.Header className="bg-secondary text-light"> 
                <h6>View Only (Public)</h6>
              </Card.Header>
              <div className="d-flex flex-wrap justify-content-start">
                {boards.map((x: Board) =>
                  x.PermissionLevel === "Viewer"
                  ? <BoardCard key={x.UpdateHashCode} Title={x.Title} BoardId={x.Id} CreatedBy={x.CreatedBy} getBoards={getBoards} IsPublic={x.IsPubliclyVisible} />
                  : null
                  )}
              </div>
            </Card>
          </Card.Body>
        </Card>
      </div>
      <Card className="col-2 bg-light">
        <Card.Body>
          <h6>Users</h6>
          <small>
          {boardUsers.map((x: User) =>
            <div key={x.Id}>{x.UserName}</div>
          )}
          </small>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BoardsView;