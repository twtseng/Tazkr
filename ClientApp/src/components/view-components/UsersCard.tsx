import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import { Card } from 'react-bootstrap';
import Select from 'react-select';
import { Board, User } from './TazkrObjects';
import { getUsers, selectUsers } from '../features/users/usersSlice';

interface Props {
    getBoard: () => void;
    board: Board;
}

const UsersCard = (props: Props) => {
    const appUsers = useSelector(selectUsers);
    const userOptions = appUsers.map((x:User) => ({ value: x.Id, label: x.UserName}));
    const dispatch = useDispatch();
    const refreshAppUsers = () => {
        dispatch(getUsers()); 
    }
    
    React.useEffect(()=>{
        refreshAppUsers();
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
            {props.board.BoardUsers.map((x:User) => (
                <div key={x.Id}><span style={{verticalAlign:"middle", color: x.Online ? "lightseagreen" : "darkgray"}}>&#8226; </span>
                        <small style={{verticalAlign:"middle"}}>{x.UserName}</small>
                </div>
            ))}
        </Card.Body>
      </Card>
    )
}

export default UsersCard
