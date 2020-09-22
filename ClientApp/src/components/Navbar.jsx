import React,{useState} from 'react';
import {Link,navigate} from '@reach/router';
import {AppBar,Toolbar,Typography} from '@material-ui/core';

export default props => {
    const [auth,setAuth] = useState(false);
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h4" >
                  <Link style={{color:"white"}} to="/">Tazkr</Link>
                </Typography>
                <Typography variant="h4">
                  <Link style={{color:"white"}} to="/board">Board</Link>
                </Typography>
                <Typography variant="h4">
                  {auth ? 
                  <Link style={{color:"white"}} to="/profile">Profile</Link> : 
                  <Link style={{color:"white"}} to="/login">Login</Link>}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}