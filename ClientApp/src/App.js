import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Home2 from './components/Home2';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import AppContext from './components/AppContext';

import './custom.css'
const signalR = "";
export default () => {
 
  return (
    <AppContext.Provider value={{signalR}}>
      <Layout>
        <AuthorizeRoute exact path='/' component={Home} />
        <AuthorizeRoute path='/home2' component={Home2} />
        <Route path='/counter' component={Counter} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    </AppContext.Provider>
  );
}

