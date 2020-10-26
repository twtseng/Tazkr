import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import AppContext from './components/AppContext';
import { SignalRHub } from './components/api-board-data/SignalRHub';
import BoardsView from './components/views/BoardsView';
import BoardView from './components/views/BoardView';


import './custom.css'
const signalRHub = new SignalRHub();
export default () => {
 
  return (
    <AppContext.Provider value={{signalRHub}}>
      <Layout>
        <AuthorizeRoute exact path='/' component={BoardsView} />
        <AuthorizeRoute exact path='/boards' component={BoardsView} />
        <AuthorizeRoute exact path='/board/:boardId' component={BoardView} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    </AppContext.Provider>
  );
}

