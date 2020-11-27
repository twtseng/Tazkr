import { createSlice } from '@reduxjs/toolkit';

import { Board }  from '../../view-components/TazkrObjects';
import * as BoardData from '../../api-board-data/BoardDataApi';
import { RootState, AppDispatch } from '../../redux/store';

const findCardById = (inputBoard: Board, cardId: string) => {
  for (let colIndex = 0; colIndex < inputBoard.Columns.length; ++colIndex) {
      const column = inputBoard.Columns[colIndex];
      for (let cardIndex = 0; cardIndex < column.Cards.length; ++cardIndex) {
          if (column.Cards[cardIndex].Id === cardId) {
              return column.Cards[cardIndex];
          }
      }
  }
  return null;
}
const findColumnById = (inputBoard: Board, columnId: string) => {
  for (let colIndex = 0; colIndex < inputBoard.Columns.length; ++colIndex) {
      if (inputBoard.Columns[colIndex].Id === columnId) {
          return inputBoard.Columns[colIndex];
      }
  }
  return null;
}

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
        const card = findCardById(state.board, taskId);
        const fromCol = findColumnById(state.board, fromColId);
        const toCol = findColumnById(state.board, toColId);
        if (fromColId === toColId && fromCol !== null && card !== null) {
          // Moving task in same column
          fromCol.Cards.splice(fromIndex, 1);
          fromCol.Cards.splice(toIndex, 0, card);
        } else if (fromCol !== null && toCol !== null && card !== null) { 
          // Moving task to new column
          fromCol.Cards.splice(fromIndex, 1);
          toCol.Cards.splice(toIndex, 0, card);
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

