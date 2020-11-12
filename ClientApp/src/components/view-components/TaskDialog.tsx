import React from 'react';
import { Button, FormGroup, Form, Modal } from 'react-bootstrap';
import * as BoardDataApi from '../api-board-data/BoardDataApi';

interface Props {
    getBoard: () => void;
    closeDialog: () => void;
    Title: string;
    Description: string;
    showTaskDialog: boolean;
    CardId: string;
    BoardId: string;
}

const TaskDialog = (props: Props) => {
    const [cardTitle, setCardTitle] = React.useState(props.Title);
    const [cardDescription, setCardDescription] = React.useState(props.Description);
    const updateCard = () => {
        BoardDataApi.updateCard(props.CardId,cardTitle,cardDescription,props.BoardId)
            .then(() => {
                console.log("updateCard completed");
                props.getBoard();
                props.closeDialog();
            })
            .catch((err) => {
                console.log(`updateCard failed, err = ${err}`);
                props.closeDialog();
            });
    }
    const deleteCard = () => {
        BoardDataApi.deleteCard(props.CardId,props.BoardId)
            .then(() => {
                console.log("deleteCard completed");
                props.getBoard();
            })
            .catch((err) => {
                console.log(`deleteCard failed, err = ${err}`);
                props.closeDialog();
            });
    }
    return (
        <Modal show={props.showTaskDialog} onHide={props.closeDialog}>
            <Modal.Header closeButton>
            <Modal.Title>{props.Title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="mt-3">
                    <FormGroup>
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="title" 
                            id="title" 
                            placeholder="enter title" 
                            value={cardTitle}
                            onChange={e => setCardTitle(e.target.value)}
                            />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Description</Form.Label>
                        <textarea className="form-control"
                            rows={3}
                            placeholder="enter description" 
                            value={cardDescription}
                            onChange={e => setCardDescription(e.target.value)}
                            ></textarea>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="dnage" onClick={deleteCard}>
                <small>Delete Card</small>
            </Button>    
            <Button variant="secondary" onClick={props.closeDialog}>
                <small>Cancel</small>
            </Button>
            <Button variant="primary" onClick={updateCard}>
                <small>Save</small>
            </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TaskDialog
