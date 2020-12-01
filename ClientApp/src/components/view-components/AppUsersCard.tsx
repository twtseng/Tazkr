import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import AppContext from '../AppContext';
import { Card } from 'react-bootstrap';
import { HubMethod } from '../api-board-data/SignalRHub';
import { User } from './TazkrObjects';
import { getUsers, selectUsers } from '../features/users/usersSlice';

const AppUsersCard = () => {
    const signalRHub = React.useContext(AppContext);
    const users = useSelector(selectUsers);
    const dispatch = useDispatch();
    const refreshAppUsers = () => {
        dispatch(getUsers()); 
    }
    const updateAppUsers: HubMethod = async (arg1:any, arg2: any, arg3: any, arg4:any )=> {
        refreshAppUsers();
    }
    const joinChat = async () => {
        await signalRHub.setMethod("UpdateAppUsers", updateAppUsers);
        await signalRHub.joinChat("TazkrApp");       
    }
    React.useEffect(() => {
        joinChat();
        refreshAppUsers();
    },[]);
    return (
        <Card className="mb-2 h-25">
            <Card.Header className="bg-secondary text-light">
                Users
            </Card.Header>
            <Card.Body style={{overflowX:"auto",overflowY:"scroll", whiteSpace:"nowrap"}}>
                {users.map((x:User) => (
                    <div key={x.Id}><span style={{verticalAlign:"middle", color: x.Online ? "lightseagreen" : "darkgray"}}>&#8226; </span>
                        <small style={{verticalAlign:"middle"}}>{x.UserName}</small>
                    </div>
                ))}
            </Card.Body>
        </Card>
    )
}

export default AppUsersCard
