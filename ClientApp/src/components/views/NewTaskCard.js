import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const DragCard = styled.div`
    border: 1px solid lightgrey;
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 10px;
    background-color: ${props => (props.isDragging ? "green" : "white")}
    display: inline;
`

const TaskCard = (props) => {
    const [cardTitle, setCardTitle] = React.useState(props.Title)
    const [titleReadOnly, setTitleReadOnly] = React.useState(true)
    const updateCardTitle = () => {
        setTitleReadOnly(true);
        props.renameCard(props.CardId, cardTitle);
    }
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            updateCardTitle();
        }
    }
    return (
        <Draggable draggableId={props.CardId} index={props.Index}>
        {(provided, snapshot) => (
            <DragCard
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
            >
                <div className="col-12" onClick={() => setTitleReadOnly(false)} style={titleReadOnly ? {} : {display:"none"}}>
                    <small>{cardTitle}</small>
                </div>
                <Form.Control 
                name="taskTitle" 
                type="text" 
                value={cardTitle} 
                onChange={e => setCardTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                size="sm"
                style={titleReadOnly ? {display:"none"} : {}}
                />
            </DragCard>
        )}
        </Draggable>
    )
}

export default TaskCard
