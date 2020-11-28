import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import TaskDialog from './TaskDialog';
import TitleEdit from './TitleEdit';
import { TaskObj } from './TazkrObjects';
import {
    getBoard,
    selectBoard
} from '../features/board/boardSlice'

interface Props {
    task : TaskObj;
    refetchBoard : () => void;
}

type DragContainerStyleProp = {
    isDragging: boolean
}
const DragContainer = styled.div<DragContainerStyleProp>`
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? "darkgray" : "white")};
    border-radius: 5px;
`

const ReduxTaskCard = ({task, refetchBoard}:Props) => {
    const board = useSelector(selectBoard);
    const dispatch = useDispatch();
    const [showTaskDialog, setShowTaskDialog] = React.useState(false);
    const closeDialog = () => setShowTaskDialog(false);
    const showDialog = () => setShowTaskDialog(true);
    const [cardTitle, setCardTitle] = React.useState(task.Title)
    const renameCard = () => {
        if (cardTitle !== task.Title) {
            BoardDataApi.renameCard(task.Id, cardTitle, board !== null ? board.Id : "")
                .then(() => {
                    console.log("updateCardTitle completed");
                    dispatch(getBoard(board !== null ? board.Id : ""))
                })
                .catch((err) => console.log(`updateCardTitle failed, err = ${err}`));
        }
    }
    return (
        <Draggable draggableId={task.Id} index={task.Index}>
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
                        <small className="d-flex flex-wrap">{task.Description}</small>
                    </Card.Body>
                </Card>
                <TaskDialog
                    CardId={task.Id}
                    Title={task.Title}
                    Description={task.Description} 
                    showTaskDialog={showTaskDialog} 
                    closeDialog={closeDialog} 
                    getBoard={refetchBoard} 
                    BoardId={board !== null ? board.Id : ""}
                    />
            </DragContainer>
        )}
        </Draggable>
    )
}

export default ReduxTaskCard
