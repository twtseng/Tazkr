import React from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import callBoardDataApi from '../api-board-data/BoardDataApi';

const DragContainer = styled.div`
    border: 1px solid lightgrey;
    padding: 5px;
    margin-bottom: 8px;
    border-radius: 10px;
    background-color: ${props => (props.isDragging ? "darkgray" : "white")};
`

const TaskCard = (props) => {
    const [showTaskDialog, setShowTaskDialog] = React.useState(false);

    const handleClose = () => setShowTaskDialog(false);
    const handleShow = () => setShowTaskDialog(true);


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
    const deleteCard = () => {
        callBoardDataApi(`BoardData/DeleteCard`,"DELETE",{ Param1: props.CardId })
            .then(() => {
                console.log("deleteCard completed");
                props.getBoard();
            })
            .catch((err) => console.log(`deleteCard failed, err = ${err}`));
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
                <Card style={{border:"none"}} onClick={handleShow}>
                    <Card.Title>
                        <span onClick={() => setTitleReadOnly(false)} style={titleReadOnly ? {} : {display:"none"}}>
                            <small>{cardTitle === "" ? "<blank>" : cardTitle}</small>
                        </span>
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
                    </Card.Title>
                    <Card.Body>
                        <Button onClick={deleteCard}><small>Delete card</small></Button>
                    </Card.Body>
                </Card>
                <Modal show={showTaskDialog} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </DragContainer>
        )}
        </Draggable>
    )
}

export default TaskCard
