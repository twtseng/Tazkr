import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import callBoardDataApi from '../api-board-data/BoardDataApi';

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
        callBoardDataApi(`BoardData/RenameCard`,"PATCH",{ Param1: props.CardId, Param2: cardTitle })
            .then(() => {
                console.log("updateCardTitle completed");
                props.getBoard();
            })
            .catch((err) => console.log(`updateCardTitle failed, err = ${err}`));
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
                    <small>{cardTitle === "" ? "<blank>" : cardTitle}</small>
                </div>
                <Form.Control 
                className="input-sm" 
                name="taskTitle" 
                type="text" 
                value={cardTitle} 
                onChange={e => setCardTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                size="sm"
                style={titleReadOnly ? {display:"none"} : {}}
                />
            </DragContainer>
        )}
        </Draggable>
    )
}

export default TaskCard
