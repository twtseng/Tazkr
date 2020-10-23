import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'

const TaskList = styled.div`
    padding: 8px;
    flex-grow: 1;
    background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
    height: 70%;
    border-radius: 10px;
`;

const BoardColumn = (props) => {
    const [columnTitle, setColumnTitle] = React.useState(props.Title)
    const [titleReadOnly, setTitleReadOnly] = React.useState(true)
    const updateColumnTitle = () => {
        setTitleReadOnly(true);
        if (columnTitle !== props.Title) {
            props.renameColumn(props.ColumnId, columnTitle);
        }
    }
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            updateColumnTitle();
        }
    }
    return (
        <Card className='col-3 m-4'>
            <Card.Body>
                <div className="TitleRow d-flex justify-content-between">
                    <div className="TitleEdit">
                        <div onClick={() => setTitleReadOnly(false)} style={titleReadOnly ? {} : {display:"none"}}>
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
                    <Button className="m-2" onClick={() => props.addCardToColumn(props.ColumnId)}><small>Add task</small></Button>
                </div>
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
            </Card.Body>
        </Card>
    )
}

export default BoardColumn
