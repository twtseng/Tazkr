import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { Board, Column, TaskObj }  from '../../view-components/TazkrObjects';
import * as BoardData from '../../api-board-data/BoardDataApi';
import { RootState, AppDispatch } from '../../redux/store';

type SetBoardPayload = {
  boardId: string,
  board: Board
}

type SliceState = {
  boardMap: any 
}
const initialState: SliceState = { boardMap: {} }

export const boardSlice = createSlice({
  name: 'board',
  initialState: initialState, 
  reducers: {
    setBoard: (state, action) => {
      state.boardMap[action.payload.boardId] = action.payload.board;
    },
    moveTaskToColumn: (state, action) => {
      const { boardId, taskId, fromColId, toColId, toIndex } = action.payload;

      const board = state.boardMap[boardId];

      if (board !== null && board !== undefined) {
        let card = null;
        for (let colIndex = 0; colIndex < board.Columns.length; ++colIndex) {
          const column = board.Columns[colIndex];
          for (let cardIndex = 0; cardIndex < column.Cards.length; ++cardIndex) {
            if (column.Cards[cardIndex].Id === taskId) {
              card = {...column.Cards[cardIndex]};
            }
          }
        }
        let fromColIndex = -1;
        let toColIndex = -1;
        for (let colIndex = 0; colIndex < board.Columns.length; ++colIndex) {
          if (board.Columns[colIndex].Id === fromColId) {
            fromColIndex = colIndex;
          }
          if (board.Columns[colIndex].Id === toColId) {
            toColIndex = colIndex;
          }
        }
        if (fromColId === toColId && card !== null) {
          // Moving task in same column
          board.Columns[fromColIndex].Cards = board.Columns[fromColIndex].Cards.filter((card:TaskObj) => card.Id !== taskId);
          board.Columns[fromColIndex].Cards.splice(toIndex, 0, card);
          board.Columns[fromColIndex].Cards.forEach((card:TaskObj, index:number) => card.Index = index);
        } else if (card !== null) { 
          // Moving task to new column
          board.Columns[fromColIndex].Cards = board.Columns[fromColIndex].Cards.filter((card:TaskObj) => card.Id !== taskId);
          board.Columns[fromColIndex].Cards.forEach((card:TaskObj, index:number) => card.Index = index);
          board.Columns[toColIndex].Cards.splice(toIndex, 0, card);
          board.Columns[toColIndex].Cards.forEach((card:TaskObj, index:number) => card.Index = index);
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
    const setBoardPayload: SetBoardPayload = {
      boardId: boardId,
      board: boardData
    }
    dispatch(setBoard(setBoardPayload));
};

export const selectBoardMap = (state:RootState) => state.board.boardMap;

export default boardSlice.reducer;

