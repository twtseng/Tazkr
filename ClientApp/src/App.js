import React from 'react';
import {Router} from '@reach/router';
import Board from './views/Board';
import Login from './views/Login';
import Profile from './views/Profile';
import Home from './views/Home';
import Navbar from './components/Navbar';
import './custom.css';

export default () => {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Home path="/"/>
        <Login path="/login"/>
        <Profile path="/profile"/>
        <Board path="/board"/>
      </Router>
    </div>
  );
}

