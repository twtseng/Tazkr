
import { Board }  from '../view-components/TazkrObjects';
import * as BoardData from '../api-board-data/BoardDataApi';

export enum ActionType {
    GET_BOARDS = "GET_BOARDS"
}

export type Action = {
    type: ActionType,
    payload: any
}

export const getBoardsAction = ()  => {
    return async (dispatch: (action:Action) => void) => {
        const boards = await BoardData.getBoards();
        console.log(`getBoardsAction: ${JSON.stringify(boards)}`)
        dispatch({ type: ActionType.GET_BOARDS, payload: boards});
    };
};