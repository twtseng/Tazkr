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
        <Card className='col-4 mr-2'>
            
                <div className="TitleRow d-flex justify-content-between">
                    <div className="TitleEdit">
                        <div
                            className="editable"
                            onClick={() => setTitleReadOnly(false)} style={titleReadOnly ? {} : {display:"none"}}>
                            <b>{columnTitle === "" ? "<blank>" : columnTitle}</b>
                        </div>
                        <Form.Control 
                            className="col-12 input-sm" 
                            name="columnTitle" 
                            type="text" 
                            value={columnTitle} 
                            onChange={e => setColumnTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onMouseLeave={updateColumnTitle}
                            size="sm"
                            style={titleReadOnly ? {display:"none"} : {}}
                        />
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle variant="muted" id="dropdown-basic">
                            <small>Column actions</small>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={addCardToColumn}>Add Card</Dropdown.Item>
                            <Dropdown.Item onClick={deleteColumn}>Delete Column</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Card.Body style={{minHeight:"200px"}}>
                <div style={{height:"100%", display:"flex", alignItems:"stretch"}}>
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
