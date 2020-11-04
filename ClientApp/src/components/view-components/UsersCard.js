import React from 'react';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import Select from 'react-select'

const UsersCard = (props) => {
    const [userOptions, setUserOptions] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState("");
    React.useEffect(()=>{
        callBoardDataApi(`BoardData/GetUsers`,"GET",{})
        .then(results => {
            setUserOptions(results.map(x => ({ value: x.id, label: x.userName})));
        })
        .catch(err => console.log(`BoardData/GetUsers failed, error=${err}`))
    },[]);
    
    const addUser = async (user) => {
        await callBoardDataApi(`BoardData/AddUserToBoard`,"PATCH",{ Param1: props.board.boardId, Param2: user});
        props.getBoard();
    }

    return (
        <Card className="mb-2">
        <Card.Header className="bg-secondary text-light">
            Board Users
        </Card.Header>
        <Card.Body>
            <Select
                placeholder={"add user"}
                value={null} 
                onChange={item => addUser(item.value)} 
                className="text-dark form-control-sm" 
                options={userOptions}>
            </Select>     
        </Card.Body>
        <Card.Body>
            {props.board.boardUsers.map(x => (
                <div><small>{x.userName}</small></div>
            ))}
        </Card.Body>
      </Card>
    )
}

export default UsersCard
