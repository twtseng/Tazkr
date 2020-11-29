import React from 'react'
import authService from '../api-authorization/AuthorizeService';
import { Redirect } from 'react-router';

const HomeView = () => {
    if (authService.isAuthenticated()) {
        return <Redirect to="/boards" />
    }
    else {
        return <Redirect to="/authentication/login" />
    }
}

export default HomeView
