import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { Board, Column }  from '../../view-components/TazkrObjects';
import * as BoardData from '../../api-board-data/BoardDataApi';
import { RootState, AppDispatch } from '../../redux/store';

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
          state.board.Columns[fromColIndex].Cards = state.board.Columns[fromColIndex].Cards.filter(card => card.Id !== taskId);
          state.board.Columns[fromColIndex].Cards.splice(toIndex, 0, card);
          state.board.Columns[fromColIndex].Cards.forEach((card, index) => card.Index = index);
        } else if (card !== null) { 
          // Moving task to new column
          state.board.Columns[fromColIndex].Cards = state.board.Columns[fromColIndex].Cards.filter(card => card.Id !== taskId);
          state.board.Columns[fromColIndex].Cards.forEach((card, index) => card.Index = index);
          state.board.Columns[toColIndex].Cards.splice(toIndex, 0, card);
          state.board.Columns[toColIndex].Cards.forEach((card, index) => card.Index = index);
        }
      }
    }
  },
});

export const { setBoard, moveTaskToColumn } = boardSlice.actions;

export const getBoard = (boardId: string) => async (dispatch: AppDispatch) => {
    const boardData = await BoardData.getBoard(boardId);
    boardData.Columns.sort((a:Column,b:Column) => { return a.Index - b.Index });
    boardData.Columns.forEach((col:Column) => {
      col.Cards.sort((a,b) => { return a.Index - b.Index });
    });
    dispatch(setBoard(boardData));
};

export const selectBoard = (state:RootState) => state.board.board;

export default boardSlice.reducer;

