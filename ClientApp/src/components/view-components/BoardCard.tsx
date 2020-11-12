import React from 'react'
import { useHistory } from "react-router-dom";
import { Card } from 'react-bootstrap';
import TitleEdit from './TitleEdit';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import { User } from './TazkrObjects';

interface Props {
  Title: string;
  BoardId: string;
  getBoards: () => void;
  CreatedBy: User;
}

const BoardCard = (props:Props) => {
    const history = useHistory();
    const [boardTitle, setBoardTitle] = React.useState(props.Title);
    const renameBoard = async () => {
      console.log(`BoardCard.renameBoard: boardTitle[${boardTitle}] props.Title[${props.Title}]`);
      if (boardTitle !== props.Title) {
        console.log(`BoardCard.renameBoard calling rename board`)
        BoardDataApi.renameBoard(props.BoardId, boardTitle)
        .then(() => { console.log("renameBoard completed"); props.getBoards() })
        .catch((err) => console.log(`renameBoard failed, err = ${err}`));
      }
    }
    return (
      <Card className='clickable p-0 m-2' 
          key={props.BoardId} 
          onClick={() => history.push(`/board/${props.BoardId}`)}
          style={{width:"220px"}}
      >
        <Card.Header className="bg-secondary text-light">
          <TitleEdit
              className="text-dark bg-light font-weight-bold"
              size="sm"
              title={boardTitle} 
              setTitle={setBoardTitle}
              updateTitle={renameBoard}        
          />
        </Card.Header>
        <Card.Body>
          <small>
            <div>Owner</div>
            <div>{props.CreatedBy.UserName}</div>
          </small>
        </Card.Body>
      </Card>
    )
}

export default BoardCard
