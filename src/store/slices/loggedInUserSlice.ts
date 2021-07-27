import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responceUserData } from '../../models/responceData';

export const loggedInUserSlice = createSlice({
  name: 'activeUser',
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
    logoutActiveUser: (state) => {
      state.activeUser = {
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
      };
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
  activeUser: {
    activeUser: responceUserData;
  };
};

export const { setActiveUser, logoutActiveUser, updateLikes, updateFollowing, updateProfileWithImage, updateProfile } = loggedInUserSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectLoggedInUser = (state: RootState) => state.activeUser.activeUser;
export default loggedInUserSlice.reducer;
