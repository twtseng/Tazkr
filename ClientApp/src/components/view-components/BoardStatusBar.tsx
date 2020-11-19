import React from 'react'
import { Form, Dropdown } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import TitleEdit from './TitleEdit';
import { Board, BoardPermissionLevel } from './TazkrObjects';
import BoardPermissionButton from './BoardPermissionButton';
import BoardVisibilityDropdown from './BoardVisibilityDropdown';

interface Props {
  board : Board;
  boardTitle: string;
  setBoardTitle: (title:string) => void;
  getBoard: () => void;
  permissionLevel: BoardPermissionLevel;
}

const BoardStatusBar = (props: Props) => {
    const history = useHistory();

    const addColumn = async () => {
      await BoardDataApi.addColumn(props.board.Id, "New Column");
      props.getBoard();
    }
    const deleteBoard = async () => {
      BoardDataApi.deleteBoard(props.board.Id)
      .then(() => history.push("/boards"))
      .catch(err => alert(err))
    }
    const renameBoard = async () => {
      if (props.boardTitle !== props.board.Title) {
        BoardDataApi.renameBoard(props.board.Id, props.boardTitle)
        .then(() => console.log("renameBoard completed"))
        .catch((err) => console.log(`renameBoard failed, err = ${err}`));
      }
    }
   
    return (
        <div className="TitleRow d-flex flex-column flex-md-row justify-content-between">
          <TitleEdit
              className="col-md-4 text-dark bg-light font-weight-bold"
              // size="lg"
              title={props.boardTitle}
              setTitle={props.setBoardTitle}
              updateTitle={renameBoard}        
          />
          <BoardPermissionButton className="" permissionLevel={props.permissionLevel} />
          <BoardVisibilityDropdown className="" boardId={props.board.Id} isPubliclyVisible={props.board.IsPubliclyVisible} getBoard={props.getBoard}/>
          <Dropdown>
              <Dropdown.Toggle className="text-light" variant="muted">
                  Board actions
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item onClick={addColumn}><small>Add Column</small></Dropdown.Item>
              <Dropdown.Item onClick={deleteBoard}><small>Delete Board</small></Dropdown.Item>
              </Dropdown.Menu>
          </Dropdown>
        </div>  
    )
}

export default BoardStatusBar
