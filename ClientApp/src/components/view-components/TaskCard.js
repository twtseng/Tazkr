import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import TaskDialog from './TaskDialog';

const DragContainer = styled.div`
 
    margin-bottom: 8px;
   
    background-color: ${props => (props.isDragging ? "darkgray" : "white")};
`

const TaskCard = (props) => {
    const [showTaskDialog, setShowTaskDialog] = React.useState(false);

    const closeDialog = () => setShowTaskDialog(false);
    const showDialog = () => setShowTaskDialog(true);


    const [cardTitle, setCardTitle] = React.useState(props.Title)
    const [titleReadOnly, setTitleReadOnly] = React.useState(true)

    const updateCardTitle = () => {
        document.getSelection().removeAllRanges();
        setTitleReadOnly(true);
        callBoardDataApi(`BoardData/UpdateCard`,"PATCH",{ Param1: props.CardId, Param2: cardTitle })
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
                <Card
                    style={{border:"none", padding:"5px", border:"solid 1px black"}} 
                    onClick={showDialog} className="clickable">
                    <Card.Title>
                        <Form.Control
                            className="col-10"
                            name="taskTitle" 
                            type="text" 
                            value={cardTitle} 
                            onChange={e => setCardTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onClick={(e) => { e.stopPropagation(); setTitleReadOnly(false); e.target.select();}}
                            onMouseLeave={() => { updateCardTitle(); }}
                            readOnly={titleReadOnly}
                        />
                    </Card.Title>
                </Card>
                <TaskDialog
                    CardId={props.CardId}
                    Title={props.Title}
                    Description={props.Description} 
                    showTaskDialog={showTaskDialog} 
                    closeDialog={closeDialog} 
                    getBoard={props.getBoard} 
                    />
            </DragContainer>
        )}
        </Draggable>
    )
}

export default TaskCard
