import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responceUserData } from '../../models/responceData';

export const loggedInUserSlice = createSlice({
  name: 'activeuser',
  initialState: {
    activeUser: {
      bikeImageUrl: '',
      carModel: '',
      dateCreated: 0,
      emailAddress: '',
      followers: [''],
      following: [''],
      likes: [''],
      maker: '',
      userId: '',
      username: '',
      docId: undefined,
    } as responceUserData,
  },
  reducers: {
    setActiveUser: (state, action: PayloadAction<responceUserData>) => {
      state.activeUser = action.payload;
    },
    updateLikes: (state) => {
      // eslint-disable-next-line no-console
      console.log('updateLikes');
    },
    updateFollowing: (state) => {
      // eslint-disable-next-line no-console
      console.log('updateFollowing');
    },
    updateProfileWithImage: (state) => {
      // eslint-disable-next-line no-console
      console.log('updateProfileWithImage');
    },
    updateProfile: (state) => {
      // eslint-disable-next-line no-console
      console.log('updateProfile');
    },
  },
});

type RootState = {
  activeuser: {
    activeUser: responceUserData;
  };
};

export const { setActiveUser, updateLikes, updateFollowing, updateProfileWithImage, updateProfile } = loggedInUserSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectUser = (state: RootState) => state.activeuser.activeUser;
export default loggedInUserSlice.reducer;
