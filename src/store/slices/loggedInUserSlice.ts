import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responceUserData } from '../../models/responceData';

interface UPDATELIKESOBJ {
  toggleLiked: boolean;
  docId: string;
}

interface UPDATEFOLLOWINGOBJ {
  isFollowingProfile: boolean;
  profileUserId: string;
}

interface UPDATEPLOFILEWITHIMAGEOBJ {
  bikeImageUrl: string;
  carModel: string;
  emailAddress: string;
  maker: string;
  username: string;
}

interface UPDATEPLOFILEOBJ {
  carModel: string;
  emailAddress: string;
  maker: string;
  username: string;
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
    updateFollowing: (state, action: PayloadAction<UPDATEFOLLOWINGOBJ>) => {
      state.activeUser.following = action.payload.isFollowingProfile
        ? state.activeUser.following.filter((uid) => uid !== action.payload.profileUserId)
        : [...state.activeUser.following, action.payload.profileUserId];
    },
    updateProfileWithImage: (state, action: PayloadAction<UPDATEPLOFILEWITHIMAGEOBJ>) => {
      state.activeUser.bikeImageUrl = action.payload.bikeImageUrl;
      state.activeUser.carModel = action.payload.carModel;
      state.activeUser.emailAddress = action.payload.emailAddress;
      state.activeUser.maker = action.payload.maker;
      state.activeUser.username = action.payload.username;
    },
    updateProfile: (state, action: PayloadAction<UPDATEPLOFILEOBJ>) => {
      state.activeUser.carModel = action.payload.carModel;
      state.activeUser.emailAddress = action.payload.emailAddress;
      state.activeUser.maker = action.payload.maker;
      state.activeUser.username = action.payload.username;
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
