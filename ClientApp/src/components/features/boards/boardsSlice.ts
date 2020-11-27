import { createSlice } from '@reduxjs/toolkit';

import { Board }  from '../../view-components/TazkrObjects';
import * as BoardData from '../../api-board-data/BoardDataApi';
import { RootState, AppDispatch } from '../../redux/store';

const initialState: any = {
  boards: [
    { 
      Title: "Board 123",
    },
    { 
      Title: "Board 234",
    }
  ]
}

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: initialState,
  reducers: {
    setBoards: (state, action) => {
        console.log(`boardSlice.setBoards called`)
        state.boards = action.payload;
    }
  },
});

export const { setBoards } = boardsSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getBoards = () => async (dispatch: AppDispatch) => {
    console.log(`boardSlice.getBoards called`)
    const boards = await BoardData.getBoards();
    dispatch(setBoards(boards));
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBoards = (state:RootState) => state.boards.boards;

export default boardsSlice.reducer;

