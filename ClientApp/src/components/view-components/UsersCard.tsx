import React from 'react';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import { Card } from 'react-bootstrap';
import Select from 'react-select';
import { Board, User } from './TazkrObjects';

interface Props {
    getBoard: () => void;
    board: Board;
}

const UsersCard = (props: Props) => {
    const [userOptions, setUserOptions] = React.useState([]);
    React.useEffect(()=>{
        callBoardDataApi(`BoardData/GetUsers`,"GET",{})
        .then(results => {
            setUserOptions(results.map((x:User) => ({ value: x.Id, label: x.UserName})));
        })
        .catch(err => console.log(`BoardData/GetUsers failed, error=${err}`))
    },[]);
    
    const addUser = async (user: string) => {
        await callBoardDataApi(`BoardData/AddUserToBoard`,"PATCH",{ Param1: props.board.Id, Param2: user});
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
                onChange={(item:any) => addUser(item.value)} 
                className="text-dark form-control-sm" 
                options={userOptions}>
            </Select>     
        </Card.Body>
        <Card.Body>
            {props.board.BoardUsers.map(x => (
                <div key={x.Id}><small>{x.UserName}</small></div>
            ))}
        </Card.Body>
      </Card>
    )
}

export default UsersCard
