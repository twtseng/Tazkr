import React from 'react'
import { SignalRHub } from './api-board-data/SignalRHub';

const AppContext = React.createContext<SignalRHub>(new SignalRHub());
export default AppContext;
