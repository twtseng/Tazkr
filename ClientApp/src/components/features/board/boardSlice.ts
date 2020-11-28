import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { Board }  from '../../view-components/TazkrObjects';
import * as BoardData from '../../api-board-data/BoardDataApi';
import { RootState, AppDispatch } from '../../redux/store';
import { Writable } from 'stream';

type SliceState = {
  board: Board | null
}
const initialState: SliceState = { board: null }

export const boardSlice = createSlice({
  name: 'board',
  initialState: initialState, 
  reducers: {
    setBoard: (state, action) => {
      state.board = action.payload;
    },
    moveTaskToColumn: (state, action) => {
      const { taskId, fromColId, toColId, fromIndex, toIndex } = action.payload;

      if (state.board !== null) {
        let card = null;
        for (let colIndex = 0; colIndex < state.board.Columns.length; ++colIndex) {
          const column = state.board.Columns[colIndex];
          for (let cardIndex = 0; cardIndex < column.Cards.length; ++cardIndex) {
            if (column.Cards[cardIndex].Id === taskId) {
              card = {...column.Cards[cardIndex]};
            }
          }
        }
        let fromColIndex = -1;
        let toColIndex = -1;
        for (let colIndex = 0; colIndex < state.board.Columns.length; ++colIndex) {
          if (state.board.Columns[colIndex].Id === fromColId) {
            fromColIndex = colIndex;
          }
          if (state.board.Columns[colIndex].Id === toColId) {
            toColIndex = colIndex;
          }
        }
        if (fromColId === toColId && card !== null) {
          // Moving task in same column
          state.board.Columns[fromColIndex].Cards.splice(fromIndex, 1);
          state.board.Columns[fromColIndex].Cards.splice(toIndex, 0, card);
        } else if (card !== null) { 
          // Moving task to new column
          state.board.Columns[fromColIndex].Cards.splice(fromIndex, 1);
          state.board.Columns[toColIndex].Cards.splice(toIndex, 0, card);
        }
      }
    }
  },
});

export const { setBoard, moveTaskToColumn } = boardSlice.actions;

export const getBoard = (boardId: string) => async (dispatch: AppDispatch) => {
    const board = await BoardData.getBoard(boardId);
    dispatch(setBoard(board));
};

export const selectBoard = (state:RootState) => state.board.board;

export default boardSlice.reducer;

