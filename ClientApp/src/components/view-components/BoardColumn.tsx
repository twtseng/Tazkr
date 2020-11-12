import React, { FunctionComponent } from 'react'
import { Card, Dropdown } from 'react-bootstrap'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import TitleEdit from './TitleEdit';

type TaskListStyleProp = {
    isDraggingOver: boolean
}
const TaskList = styled.div<TaskListStyleProp>`
    padding: 8px;
    flex-grow: 1;
    background-color: ${props => (props.isDraggingOver ? 'lightgray' : '#17a2b8!important')};
    border-radius: 10px;
    overflow-x: hidden;
`;
interface Props {
    Index : number;
    ColumnId: string;
    HashCode: number;
    Title: string;
    BoardId: string;
    getBoard: () => void;
}
const BoardColumn: FunctionComponent<Props> = (props) => {
    const [columnTitle, setColumnTitle] = React.useState(props.Title)
    const updateColumnTitle = () => {
        console.log(`updateColumnTitle: columnTitle=[${columnTitle}] props.Title:[${props.Title}]`)
        if (columnTitle !== props.Title) {
            console.log(`updateColumnTitle updating the column in the db...`)
            BoardDataApi.renameColumn(props.ColumnId,columnTitle)
            .then(() => { console.log("updateColumnTitle completed"); props.getBoard(); })
            .catch((err) => console.log(`updateColumnTitle failed, err = ${err}`));
        }
    }
    const deleteColumn = async () => {
        await BoardDataApi.deleteColumn(props.ColumnId);
        props.getBoard();
      }
    const addCardToColumn = () => {   
        BoardDataApi.addCardToColumn(props.ColumnId,  "New Task", props.BoardId )
        .then(() => {
            console.log("addCardToColumn completed");
            props.getBoard();
        })
        .catch((err) => console.log(`addCardToColumn failed, err = ${err}`));
    }
    return (
        <Card className='mr-4 p-0 bg-info' style={{height: "100%", minWidth:"300px"}}> 
            <Card.Header className="bg-secondary text-light">   
                <div className="TitleRow d-flex justify-content-between align-baseline">
                    <div className="TitleEdit align-text-bottom">
                        <TitleEdit
                            className="text-dark bg-light font-weight-bold"
                            size="sm"
                            title={columnTitle} 
                            setTitle={setColumnTitle}
                            updateTitle={updateColumnTitle}        
                        />
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle className="text-light" variant="muted" id="dropdown-basic">
                            <small>...</small>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={addCardToColumn}><small>Add Card</small></Dropdown.Item>
                            <Dropdown.Item onClick={deleteColumn}><small>Delete Column</small></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                </Card.Header>  
                <Card.Body
                    className="p-1"
                    style={{minHeight:"200px", maxHeight:"100%", display:"block", overflowY:"scroll", overflowX:"clip"}}
                >
                <div style={{minHeight:"100%", display:"flex"}}>
                    <Droppable droppableId={props.ColumnId} type={"ColumnDroppable"}>
                        { (provided, snapshot) => (
                            <TaskList
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                { props.children }
                                {provided.placeholder}
                            </TaskList>
                        )}
                    </Droppable>
                </div>
            </Card.Body>
        </Card>
    )
}

export default BoardColumn
