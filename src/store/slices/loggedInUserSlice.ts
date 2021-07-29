import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responceUserData } from '../../models/responceData';

interface UPDATELIKESOBJ {
  toggleLiked: boolean;
  docId: string;
}

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
    updateLikes: (state, action: PayloadAction<UPDATELIKESOBJ>) => {
      state.activeUser.likes = action.payload.toggleLiked
        ? state.activeUser.likes.filter((likeId) => likeId !== action.payload.docId)
        : [...state.activeUser.likes, action.payload.docId];
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
