import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import TaskDialog from './TaskDialog';
import TitleEdit from './TitleEdit';
import { borderRadius } from 'react-select/src/theme';

interface Props {
    Index : number;
    CardId: string;
    BoardId: string;
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
    border-radius: 5px;
`

const TaskCard = (props:Props) => {
    const [showTaskDialog, setShowTaskDialog] = React.useState(false);
    const closeDialog = () => setShowTaskDialog(false);
    const showDialog = () => setShowTaskDialog(true);
    const [cardTitle, setCardTitle] = React.useState(props.Title)
    const renameCard = () => {
        if (cardTitle !== props.Title) {
            BoardDataApi.renameCard(props.CardId, cardTitle, props.BoardId)
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
        
                    onClick={showDialog} 
                    className="clickable">                       
                    <Card.Header className="bg-secondary text-light">
                        <TitleEdit
                            className="text-dark bg-light font-weight-bold"
                            size="sm"
                            title={cardTitle} 
                            setTitle={setCardTitle}
                            updateTitle={renameCard}        
                        />
                    </Card.Header>
                    <Card.Body className="d-flex flex-wrap">
                        <small className="d-flex flex-wrap">{props.Description}</small>
                    </Card.Body>
                </Card>
                <TaskDialog
                    CardId={props.CardId}
                    Title={props.Title}
                    Description={props.Description} 
                    showTaskDialog={showTaskDialog} 
                    closeDialog={closeDialog} 
                    getBoard={props.getBoard} 
                    BoardId={props.BoardId}
                    />
            </DragContainer>
        )}
        </Draggable>
    )
}

export default TaskCard
