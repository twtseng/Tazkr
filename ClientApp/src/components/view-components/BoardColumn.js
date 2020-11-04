import React from 'react'
import { Button, Card, Form, Dropdown } from 'react-bootstrap'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import callBoardDataApi from '../api-board-data/BoardDataApi';

const TaskList = styled.div`
    padding: 8px;
    flex-grow: 1;
    background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
    border-radius: 10px;
`;

const BoardColumn = (props) => {
    const [columnTitle, setColumnTitle] = React.useState(props.Title)
    const [titleReadOnly, setTitleReadOnly] = React.useState(true)
    const updateColumnTitle = () => {
        setTitleReadOnly(true);
        if (columnTitle !== props.Title) {
            callBoardDataApi(`BoardData/RenameColumn`,"PATCH",{ Param1: props.ColumnId, Param2: columnTitle })
            .then(() => console.log("updateColumnTitle completed"))
            .catch((err) => console.log(`updateColumnTitle failed, err = ${err}`));
        }
    }
    const deleteColumn = async () => {
        await callBoardDataApi(`BoardData/DeleteColumn`,"DELETE",{ Param1: props.ColumnId });
        props.getBoard();
      }
    const addCardToColumn = () => {   
        callBoardDataApi(`BoardData/AddCardToColumn`,"PUT",{ Param1: props.ColumnId, Param2: "New Task" })
        .then(() => {
            console.log("addCardToColumn completed");
            props.getBoard();
        })
        .catch((err) => console.log(`addCardToColumn failed, err = ${err}`));
    }
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            updateColumnTitle();
        }
    }

    return (
        <Card className='mr-2 p-0 taskcolumn' style={{height: "100%"}}> 
            <Card.Header className="bg-secondary text-light">   
                <div className="TitleRow d-flex justify-content-between align-baseline">
                    <div className="TitleEdit align-text-bottom">
                        <div
                            className="editable align-text-bottom font-weight-bold"
                            onClick={() => setTitleReadOnly(false)} 
                            style={titleReadOnly ? {} : {display:"none"}}>
                            {columnTitle === "" ? "<title blank>" : columnTitle}
                        </div>
                        <Form.Control
                            className="col-12 input-sm text-dark font-weight-bold" 
                            name="columnTitle" 
                            type="text" 
                            value={columnTitle} 
                            onChange={e => setColumnTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onMouseLeave={updateColumnTitle}
                            onFocus={(e) => e.target.select()}
                            size="sm"
                            style={titleReadOnly ? {display:"none"} : {}}
                        />
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle className="text-light" variant="muted" id="dropdown-basic">
                            <small>Column actions</small>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={addCardToColumn}><small>Add Card</small></Dropdown.Item>
                            <Dropdown.Item onClick={deleteColumn}><small>Delete Column</small></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                </Card.Header> 
                <Card.Body style={{minHeight:"200px", maxHeight:"100%", display:"block", overflowY:"scroll"}}>
                <div style={{minHeight:"100%", display:"flex"}}>
                <Droppable droppableId={props.ColumnId} type={"ColumnDroppable"}>
                    { (provided, snapshot) => (
                        <TaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            { props.children }
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
                </div>
            </Card.Body>
        </Card>
    )
}

export default BoardColumn
