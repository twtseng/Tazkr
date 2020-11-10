import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import authService from './components/api-authorization/AuthorizeService';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import AppContext from './components/AppContext';
import { SignalRHub } from './components/api-board-data/SignalRHub';
import BoardsView from './components/views/BoardsView';
import BoardView from './components/views/BoardView';


import './custom.css'
const signalRHub = new SignalRHub();

export default () => {
  const ensureLogin = () => {
    authService.getAccessToken()
    .then(token => {
      console.log(`ensureLogin getAccessToken succeeded`);
      signalRHub.startHub(token)
      .then(() => 
        console.log(`Ensure login signalRHub connectionState: ${signalRHub.hub.connectionState}`)
        );
    })
    .catch(e => console.log(`ensureLogin error: ${e}`))
  }
  React.useEffect(()=>{
    ensureLogin();
  },[])
  return (
    <AppContext.Provider value={signalRHub}>
      <Layout>
        <AuthorizeRoute exact path='/' component={BoardsView} />
        <AuthorizeRoute exact path='/boards' component={BoardsView} />
        <AuthorizeRoute exact path='/board/:boardId' component={BoardView} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    </AppContext.Provider>
  );
}

