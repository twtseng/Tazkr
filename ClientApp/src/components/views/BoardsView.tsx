import React from 'react';
import {  Button, Card } from 'react-bootstrap'
import AppContext from '../AppContext';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import { HubMethod } from '../api-board-data/SignalRHub';
import BoardCard from '../view-components/BoardCard';
import { Board, User } from '../view-components/TazkrObjects';

const BoardsView = () => {

  const [boards, setBoards] = React.useState([]);
  const signalRHub = React.useContext(AppContext);
  const getBoards = async () => {
      const boardsData = await callBoardDataApi("BoardData/Boards","GET");
      boardsData.sort((a:Board,b:Board) => { return (new Date(a.CreatedDateUTC)) > (new Date(b.CreatedDateUTC)) ? 1 : -1 });
      setBoards(boardsData);
  }
  const createBoard = async () => {
    const boardsData = await callBoardDataApi("BoardData/Boards","POST", { Param1: "New Board" });
    getBoards();
  }
  const [boardUsers, setBoardUsers] = React.useState([]);
  const updateAppUsers: HubMethod = (arg1:any, arg2: any, arg3: any, arg4:any )=> {
    console.log( `UpdateAppUsers: ${JSON.stringify(arg1)}`);
    setBoardUsers(arg1);
  }
  React.useEffect(() => {
    signalRHub.setMethod("UpdateAppUsers", updateAppUsers);
    getBoards();
  },[]);
  return (
    <div className="col-12 d-flex">
      <div className="col-10 h-100">
        <Card className="d-flex flex-column bg-light h-100">
          <Card.Body>
            <Card className="d-flex flex-column bg-light h-100">
              <Card.Header className="bg-secondary text-light d-flex"> 
                <h6 className="mr-4">Created by you</h6>
                <Button onClick={createBoard}>Add a Board</Button>
              </Card.Header>
              <div className="d-flex flex-wrap justify-content-start">
                {boards.map((x: Board) =>
                  x.PermissionLevel === "Owner"
                  ? <BoardCard key={x.UpdateHashCode} Title={x.Title} BoardId={x.Id} CreatedBy={x.CreatedBy} getBoards={getBoards} />
                  : <></>
                  )}
              </div>
            </Card>
            <Card className="d-flex flex-column bg-light h-100">
              <Card.Header className="bg-secondary text-light"> 
                <h6>Editable by you</h6>
              </Card.Header>
              <div className="d-flex flex-wrap justify-content-start">
                {boards.map((x: Board) =>
                  x.PermissionLevel === "User"
                  ? <BoardCard key={x.UpdateHashCode} Title={x.Title} BoardId={x.Id} CreatedBy={x.CreatedBy} getBoards={getBoards} />
                  : <></>
                  )}
              </div>
            </Card>
            <Card className="d-flex flex-column bg-light h-100">
              <Card.Header className="bg-secondary text-light"> 
                <h6>View Only</h6>
              </Card.Header>
              <div className="d-flex flex-wrap justify-content-start">
                {boards.map((x: Board) =>
                  x.PermissionLevel === "Viewer"
                  ? <BoardCard key={x.UpdateHashCode} Title={x.Title} BoardId={x.Id} CreatedBy={x.CreatedBy} getBoards={getBoards} />
                  : <></>
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