import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'

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
    )
}

export default TaskCard
