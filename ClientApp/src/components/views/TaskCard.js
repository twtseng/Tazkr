import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
    border: 1px solid lightgrey;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 2px;
    background-color: ${props => (props.isDragging ? "lightgray" : "white")};
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
            <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
            >
                <Card className='mt-2'>
                    <Card.Body> 
                        <Form.Control 
                        className="col-12 input-sm" 
                        name="taskTitle" 
                        type="text" 
                        value={cardTitle} 
                        onChange={e => setCardTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        readOnly={titleReadOnly}
                        onClick={() => setTitleReadOnly(false)}
                        onMouseLeave={() => { if (!titleReadOnly) {updateCardTitle();}}}
                        size="sm"
                        />
                        <Card.Text><small>Index: {props.Index}</small></Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )}
        </Draggable>
    )
}

export default TaskCard
