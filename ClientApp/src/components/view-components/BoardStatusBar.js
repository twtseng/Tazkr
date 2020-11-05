import React from 'react'
import { Form, Dropdown } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import callBoardDataApi from '../api-board-data/BoardDataApi';

const BoardStatusBar = (props) => {
    const [titleReadOnly, setTitleReadOnly] = React.useState(true);
    const history = useHistory();

    const addColumn = async () => {
        await callBoardDataApi(`BoardData/AddColumnToBoard`,"PATCH",{ Param1: props.board.boardId, Param2: "New Column"});
        props.getBoard();
      }
      const deleteBoard = async () => {
        callBoardDataApi(`BoardData/DeleteBoard`,"DELETE",{ Param1: props.board.boardId })
        .then(() => history.push("/boards"))
        .catch(err => alert(err))
      }
      const renameBoard = async () => {
        if (props.boardTitle !== props.board.title) {
          callBoardDataApi(`BoardData/RenameBoard`,"PATCH",{ Param1: props.board.boardId, Param2: props.boardTitle })
          .then(() => console.log("renameBoard completed"))
          .catch((err) => console.log(`renameBoard failed, err = ${err}`));
        }
        setTitleReadOnly(true);
      }
      const handleBoardTitleKeyPress = (event) => {
        if(event.key === 'Enter'){
          renameBoard();
        }
      }    
    return (
        <div className="TitleRow d-flex justify-content-between"> 
            {/* <div className="TitleEdit col-6"> */}
            <Form.Control 
                className="input-lg col-4 font-weight-bold" 
                name="taskTitle" 
                type="text" 
                value={props.boardTitle} 
                onChange={e => props.setBoardTitle(e.target.value)}
                onKeyPress={handleBoardTitleKeyPress}
                onMouseLeave={() => { renameBoard(); document.getSelection().removeAllRanges(); }}
                size="sm"
                onClick={(e) => { setTitleReadOnly(false);e.target.select();}}
                readOnly={titleReadOnly}
                />
            {/* </div> */}
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
