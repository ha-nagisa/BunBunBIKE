import firebaseApp from 'firebase';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: { uid: '', displayName: '' } as firebaseApp.User,
  },
  reducers: {
    login: (state, action: PayloadAction<firebaseApp.User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user.uid = '';
      state.user.displayName = '';
    },
  },
});

type RootState = {
  user: {
    user: firebaseApp.User;
  };
};

export const { login, logout } = userSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
