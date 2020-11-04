import React from 'react'
import { useHistory } from "react-router-dom";
import { Card } from 'react-bootstrap'

const BoardCard = props => {
    const history = useHistory();
    return (
        <Card className='col-2 clickable p-0 mr-4' 
            key={props.BoardId} 
            onClick={() => history.push(`/board/${props.BoardId}`)}
        >
          <Card.Header className="bg-secondary text-light">
            {props.Title == "" ? "<title blank>" : props.Title}
          </Card.Header>
        <Card.Body>
          <small>CreatedBy: {props.CreatedBy.email}</small>
        </Card.Body>
      </Card>
    )
}

export default BoardCard
