import React from 'react'
import { Form } from 'react-bootstrap';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import AppContext from '../AppContext';
import { HubMethod } from '../api-board-data/SignalRHub';

interface Props {
    ChatId: string;
}
  
const ChatCard = (props:Props) => {
    const signalRHub = React.useContext(AppContext);
    const [chatText, setChatText] = React.useState("");
    const [chatThread, setChatThread] = React.useState("");
    const handleChatMessage: HubMethod = (arg1:any, arg2: any, arg3: any, arg4:any )=> {
        setChatThread(chatThread+ " : " + arg1);
    }

    const handleKeyPress = async (event: any) => {
        if(event.key === 'Enter'){
            await signalRHub.setMethod("ChatMessage", handleChatMessage);
            await signalRHub.joinChat(props.ChatId);
            await BoardDataApi.sendChatMessage(props.ChatId, chatText);
            setChatText("");
        }
    }
    React.useEffect(() => {
        console.log(`ChatCard, useEffect calling joinChat: ${props.ChatId}`);
        signalRHub.setMethod("ChatMessage", handleChatMessage);
        signalRHub.joinChat(props.ChatId);
    },[]);
    return (
        <div>
            <Form.Group>
                <Form.Control as="textarea" rows={3} onKeyPress={handleKeyPress} onChange={e => setChatText(e.target.value)} value={chatText}/>
            </Form.Group>
            <Form.Group>
                <Form.Control as="textarea" rows={3}  onChange={e => setChatThread(e.target.value)} value={chatThread}/>
            </Form.Group>
        </div>
    )
}

export default ChatCard
