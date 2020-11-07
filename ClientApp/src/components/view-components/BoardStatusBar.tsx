import React from 'react'
import { Form, Dropdown } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import callBoardDataApi from '../api-board-data/BoardDataApi';
import TitleEdit from './TitleEdit';
import { Board } from './TazkrObjects';

interface Props {
  board : Board;
  boardTitle: string;
  setBoardTitle: (title:string) => void;
  getBoard: () => void;
}

const BoardStatusBar = (props: Props) => {
    const history = useHistory();

    const addColumn = async () => {
        await callBoardDataApi(`BoardData/AddColumnToBoard`,"PATCH",{ Param1: props.board.Id, Param2: "New Column"});
        props.getBoard();
      }
      const deleteBoard = async () => {
        callBoardDataApi(`BoardData/DeleteBoard`,"DELETE",{ Param1: props.board.Id })
        .then(() => history.push("/boards"))
        .catch(err => alert(err))
      }
      const renameBoard = async () => {
        if (props.boardTitle !== props.board.Title) {
          callBoardDataApi(`BoardData/RenameBoard`,"PATCH",{ Param1: props.board.Id, Param2: props.boardTitle })
          .then(() => console.log("renameBoard completed"))
          .catch((err) => console.log(`renameBoard failed, err = ${err}`));
        }
      }
      const handleBoardTitleKeyPress = (event: any) => {
        if(event.key === 'Enter'){
          renameBoard();
        }
      }    
    return (
        <div className="TitleRow d-flex justify-content-between"> 
          <TitleEdit
              className="col-4 text-dark bg-light font-weight-bold"
              size="sm"
              title={props.boardTitle}
              setTitle={props.setBoardTitle}
              updateTitle={renameBoard}        
          />  
          <Dropdown>
              <Dropdown.Toggle className="text-light" variant="muted">
                  <small>Board actions</small>
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
