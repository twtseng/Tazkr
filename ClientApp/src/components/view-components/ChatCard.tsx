import React from 'react'
import { Card, Form } from 'react-bootstrap';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import AppContext from '../AppContext';
import { HubMethod } from '../api-board-data/SignalRHub';
import { ChatMessage } from './TazkrObjects';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

interface Props {
    ChatId: string;
}
  
const ChatCard = (props:Props) => {
    dayjs.extend(utc);
    const signalRHub = React.useContext(AppContext);
    const [chatText, setChatText] = React.useState("");
    const [chatThread, setChatThread] = React.useState([]);
    const chatEndRef = React.useRef<HTMLDivElement>(null);
    const refreshChatMessages = async () => {
        const chatMessages = await BoardDataApi.getChatMessages(props.ChatId);
        setChatThread(chatMessages);
        if (chatEndRef !== null && chatEndRef.current !== null) {
            chatEndRef.current.scrollIntoView({ behavior: 'auto' });  
        }
    }
    const handleNewChatMessages: HubMethod = async (arg1:any, arg2: any, arg3: any, arg4:any )=> {
        await refreshChatMessages();
    }

    const joinChat = async () => {
        await signalRHub.setMethod("NewChatMessages", handleNewChatMessages);
        await signalRHub.joinChat(props.ChatId);       
    }
    const handleKeyPress = async (event: any) => {
        if(event.key === 'Enter'){
            joinChat();
            BoardDataApi.sendChatMessage(props.ChatId, chatText);
            setChatText("");
        }
    }
    React.useEffect(() => {
        joinChat();
        refreshChatMessages();
    },[]);
    
    const localTimeString = (utcDateString: string) :string => {
        var dateJs = dayjs.utc(utcDateString);
        return dateJs.local().format('MM-DD-YY HH:mm');
    }

    return (
        <Card className="mb-2 h-100" style={{ overflowY:"auto"}}>
            <Card.Header className="bg-secondary text-light">
                Chat
            </Card.Header>
            <Card.Body style={{ overflowY:"scroll", whiteSpace:"nowrap"}}>
                {
                    chatThread.map((x:ChatMessage) => 
                        <div key={x.UpdateHashCode}>
                            <small>
                            <div className="text-secondary"><b>{x.UserName}</b> {localTimeString(x.CreatedDateUTC)}</div>
                            <div>{x.Message}</div>
                            </small>
                        </div>
                    )
                }
                <div ref={chatEndRef}></div>
            </Card.Body>
            <Form.Control onKeyPress={handleKeyPress} onChange={e => setChatText(e.target.value)} value={chatText} placeholder="Add chat message"/>
        </Card>
    )
}

export default ChatCard
