import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';

export default ({name}) => {
    return (
        <Card style={{margin:"1rem",minWidth:200}}>
            <CardContent>
                <Typography variant="h5" component="p">
                    {name}
                </Typography>
            </CardContent>
        </Card>
    )
}