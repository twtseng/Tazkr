import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import TaskDialog from './TaskDialog';
import TitleEdit from './TitleEdit';

interface Props {
    Index : number;
    CardId: string;
    HashCode: number;
    Description: string;
    Title: string;
    getBoard: () => void;
}

type DragContainerStyleProp = {
    isDragging: boolean
}
const DragContainer = styled.div<DragContainerStyleProp>`
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? "darkgray" : "white")};
`

const TaskCard = (props:Props) => {
    const [showTaskDialog, setShowTaskDialog] = React.useState(false);
    const closeDialog = () => setShowTaskDialog(false);
    const showDialog = () => setShowTaskDialog(true);
    const [cardTitle, setCardTitle] = React.useState(props.Title)
    const updateCardTitle = () => {
        if (cardTitle !== props.Title) {
            callBoardDataApi(`BoardData/UpdateCard`,"PATCH",{ Param1: props.CardId, Param2: cardTitle })
                .then(() => {
                    console.log("updateCardTitle completed");
                    props.getBoard();
                })
                .catch((err) => console.log(`updateCardTitle failed, err = ${err}`));
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
                    style={{border:"solid 1px black", padding:"5px"}} 
                    onClick={showDialog} className="clickable">                       
                    <Card.Header className="bg-secondary text-light">
                        <TitleEdit
                            className="text-dark bg-light font-weight-bold"
                            size="sm"
                            title={cardTitle} 
                            setTitle={setCardTitle}
                            updateTitle={updateCardTitle}        
                        />
                    </Card.Header>
                    <Card.Body>
                        <div><small>HashCode: {props.HashCode}</small></div>
                        <div><small>{props.Description}</small></div>
                    </Card.Body>
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
