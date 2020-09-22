import { Card,CardContent,Typography,Button,CardActions, CardHeader } from '@material-ui/core';
import React from 'react';
import Task from './Task';
export default ({name,tasks,locked}) => {
    return (
    <Card style={{margin:"1rem"}}>
        <CardHeader title={name}/>
        <CardContent>
            {tasks && tasks.map(task => <Task name={task.name}/>)}
        </CardContent>
        <CardActions>
            <Button style={{margin:"auto"}} size="large">Add Task</Button>
        </CardActions>
    </Card>
    )
}