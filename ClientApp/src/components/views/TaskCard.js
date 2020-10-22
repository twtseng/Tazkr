import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const DragContainer = styled.div`
    border: 1px solid lightgrey;
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 10px;
    background-color: ${props => (props.isDragging ? "darkgray" : "white")};
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
            <DragContainer
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
            >
                <div onClick={() => setTitleReadOnly(false)} style={titleReadOnly ? {} : {display:"none"}}>
                    <small>{cardTitle}</small>
                </div>
                <Form.Control 
                className="input-sm" 
                name="taskTitle" 
                type="text" 
                value={cardTitle} 
                onChange={e => setCardTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                onMouseLeave={() => { if (!titleReadOnly) {updateCardTitle();}}}
                size="sm"
                style={titleReadOnly ? {display:"none"} : {}}
                />
            </DragContainer>
        )}
        </Draggable>
    )
}

export default TaskCard
