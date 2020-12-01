import { configureStore, Store } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import boardsReducer from '../features/boards/boardsSlice'
import boardReducer from '../features/board/boardSlice'
import usersReducer from '../features/users/usersSlice'

const store = configureStore({
  reducer: {
    boards: boardsReducer,
    board: boardReducer,
    users: usersReducer
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()