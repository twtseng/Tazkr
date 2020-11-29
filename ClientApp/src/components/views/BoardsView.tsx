import React from 'react'
import {  Button, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';

import BoardCard from '../view-components/BoardCard';
import ChatCard from '../view-components/ChatCard';
import AppUsersCard from '../view-components/AppUsersCard';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import { Board, User } from '../view-components/TazkrObjects';
import * as TazkrObjects from '../view-components/TazkrObjects';
import {
    getBoards,
    selectBoards,
} from '../features/boards/boardsSlice'

const BoardsView = () => {
    const boards = useSelector(selectBoards);
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getBoards())
    },[]);
    const createBoard = async () => {
        const boardsData = await BoardDataApi.createBoard("New Board");
        dispatch(getBoards());
    }

    return (
        <div className="col-12 d-flex h-100 p-0 m-0">
        <div className="p-0 pl-md-3 pr-md-3 col-md-10 h-100">
          <Card className="d-flex flex-column bg-dark h-100" style={{overflowY:"scroll"}}>
            <Card.Body>
              <Card className="d-flex flex-column bg-info mb-4">
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
              <Card className="d-flex flex-column bg-info mb-4">
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
              <Card className="d-flex flex-column bg-info mb-4">
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
        <Card className="col-2 bg-light p-1 h-100 d-none d-md-flex">
            <AppUsersCard />
            <ChatCard ChatId="TazkrApp" />
        </Card>
      </div>
    )
}

export default BoardsView

