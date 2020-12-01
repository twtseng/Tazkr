import { createSlice } from '@reduxjs/toolkit';

import { User }  from '../../view-components/TazkrObjects';
import * as BoardData from '../../api-board-data/BoardDataApi';
import { RootState, AppDispatch } from '../../redux/store';

type SliceState = {
  users: User []
}
const initialState: SliceState = { users: []}

export const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    setUsers: (state, action) => {
        state.users = action.payload;
    }
  },
});

export const { setUsers } = usersSlice.actions;

export const getUsers = () => async (dispatch: AppDispatch) => {
    const users = await BoardData.getUsers();
    const sortedUsers = users.sort(
      (a:User,b:User) => {
          if (a.Online == b.Online) {
              return a.UserName < b.UserName ? -1 : 1;
          } else {
              return a.Online ? -1 : 1;
          }
      });
    dispatch(setUsers(sortedUsers));
};

export const selectUsers = (state:RootState) => state.users.users;

export default usersSlice.reducer;

