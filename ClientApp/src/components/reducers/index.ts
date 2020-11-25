import { combineReducers } from 'redux';
import * as actions from '../actions';

const boards = (previousBoards = [], action: actions.Action) => {
    switch(action.type) {
        case actions.ActionType.GET_BOARDS:
            return action.payload
        default:
            return previousBoards;
    }
}

export default combineReducers({
    boards: boards
});