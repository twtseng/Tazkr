import { createSlice } from '@reduxjs/toolkit';

import { Board }  from '../../view-components/TazkrObjects';
import * as BoardData from '../../api-board-data/BoardDataApi';
import { RootState, AppDispatch } from '../../redux/store';

type SliceState = {
  boards: Board []
}
const initialState: SliceState = { boards: []}

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: initialState,
  reducers: {
    setBoards: (state, action) => {
        state.boards = action.payload;
    }
  },
});

export const { setBoards } = boardsSlice.actions;

export const getBoards = () => async (dispatch: AppDispatch) => {
    const boards = await BoardData.getBoards();
    dispatch(setBoards(boards));
};

export const selectBoards = (state:RootState) => state.boards.boards;

export default boardsSlice.reducer;

