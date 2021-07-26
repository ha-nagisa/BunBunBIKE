import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loggedInUserReducer from './slices/loggedInUserSlice';
import loggedInUserPhotoReducer from './slices/loggedInUserPhotosSlice';
import photoDetailModalReducer from './slices/photoDetaiModallSlice';
import ccountDeleteToastReducer from './slices/accountDeleteToastSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    activeUser: loggedInUserReducer,
    loggedInUserPhotos: loggedInUserPhotoReducer,
    photoDetail: photoDetailModalReducer,
    accountDeleteToast: ccountDeleteToastReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppDispatch = typeof store.dispatch;
