import React from 'react';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import { Card } from 'react-bootstrap';
import Select from 'react-select';
import { Board, User } from './TazkrObjects';

interface Props {
    getBoard: () => void;
    board: Board;
}

const UsersCard = (props: Props) => {
    const [userOptions, setUserOptions] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    React.useEffect(()=>{
        BoardDataApi.getUsers()
        .then(users => {
            setUserOptions(users.map((x:User) => ({ value: x.Id, label: x.UserName})));
            const sortedUsers = users.sort(
                (a:User,b:User) => {
                    if (a.Online == b.Online) {
                        return a.UserName < b.UserName ? -1 : 1;
                    } else {
                        return a.Online ? -1 : 1;
                    }
                });
            setUsers(sortedUsers);
        })
        .catch(err => console.log(`BoardData/Users failed, error=${err}`))
    },[]);
    
    const addUser = async (user: string) => {
        await BoardDataApi.addBoardUser(props.board.Id, user);
        props.getBoard();
    }

    return (
        <Card className="mb-2 h-25">
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
        <Card.Body style={{overflowX:"auto",overflowY:"scroll"}}>
            {users.map((x:User) => (
                <div key={x.Id}><span style={{verticalAlign:"middle", color: x.Online ? "lightseagreen" : "darkgray"}}>&#8226; </span>
                        <small style={{verticalAlign:"middle"}}>{x.UserName}</small>
                </div>
            ))}
        </Card.Body>
      </Card>
    )
}

export default UsersCard
