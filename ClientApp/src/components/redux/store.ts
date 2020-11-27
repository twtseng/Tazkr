import { configureStore, Store } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import boardsReducer from '../features/boards/boardsSlice'

const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()