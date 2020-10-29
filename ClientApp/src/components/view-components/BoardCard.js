import React from 'react'
import { useHistory } from "react-router-dom";
import { Card } from 'react-bootstrap'

const BoardCard = props => {
    const history = useHistory();
    return (
        <Card className='col-2 m-4 clickable' 
            key={props.BoardId} 
            onClick={() => history.push(`/board/${props.BoardId}`)}
        >
        <Card.Body>
          <Card.Title>{props.Title == "" ? "<title blank>" : props.Title}</Card.Title>
        </Card.Body>
      </Card>
    )
}

export default BoardCard
