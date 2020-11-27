import React from 'react'
import * as TazkrObjects from '../view-components/TazkrObjects';
import { useSelector, useDispatch } from 'react-redux';
import {
    getBoards,
    selectBoards,
    setBoards,
} from '../features/boards/boardsSlice'
import state from '../redux/store';

const ReduxBoardsView = () => {
    const boards = useSelector(selectBoards);
    console.log(`ReduxBoardsView: ${JSON.stringify(boards)}`)
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getBoards())
    },[]);

    return (
        <div>
            <button onClick={() => dispatch(setBoards([{Title:"Set boards test 1"}, {Title:"Set boards test 2"}]))}>Test setting boards</button>
            <button onClick={() => dispatch(getBoards())}>Test getBoards</button>
            {boards.map((x: any) => <h6>Title: {x.Title}</h6>)}
        </div>
    )
}

export default ReduxBoardsView

