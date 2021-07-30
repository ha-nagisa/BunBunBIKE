import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responcePhotoDataWithUserInfo } from '../../models/responceData';

interface updateLikesPhotoActionType {
  docId: string;
  userId: string;
  toggleLiked: boolean;
}

interface updateCommentsPhotoActionType {
  docId: string;
  displayName: string;
  comment: string;
}

export const loggedInUserPhotosSlice = createSlice({
  name: 'loggedInUserPhotos',
  initialState: {
    loggedInUserPhotos: [] as responcePhotoDataWithUserInfo[],
  },
  reducers: {
    setLoggedInUserPhotos: (state, action: PayloadAction<responcePhotoDataWithUserInfo[]>) => {
      state.loggedInUserPhotos = action.payload;
    },
    logoutLoggedInUserPhotos: (state) => {
      state.loggedInUserPhotos = [
        {
          maker: '',
          carModel: '',
          category: '',
          comments: [],
          dateCreated: 0,
          description: '',
          imageSrc: '',
          likes: [''],
          title: '',
          userId: '',
          workHours: '',
          workMoney: '',
          docId: '',
          userLikedPhoto: false,
          username: '',
        },
      ];
    },
    addLoggedInUserPhoto: (state, action: PayloadAction<responcePhotoDataWithUserInfo>) => {
      state.loggedInUserPhotos = [...state.loggedInUserPhotos, action.payload];
    },
    updateLikesPhoto: (state, action: PayloadAction<updateLikesPhotoActionType>) => {
      state.loggedInUserPhotos = state.loggedInUserPhotos.map((photo) => {
        if (photo.docId === action.payload.docId) {
          photo.userLikedPhoto = !photo.userLikedPhoto;
          photo.likes = action.payload.toggleLiked
            ? photo.likes.filter((uId) => uId !== action.payload.userId)
            : [...photo.likes, action.payload.userId];
        }
        return photo;
      });
    },
    updateCommentsPhoto: (state, action: PayloadAction<updateCommentsPhotoActionType>) => {
      state.loggedInUserPhotos = state.loggedInUserPhotos.map((photo) => {
        if (photo.docId === action.payload.docId) {
          photo.comments = [...photo.comments, { displayName: action.payload.displayName, comment: action.payload.comment }];
        }
        return photo;
      });
    },
  },
});

type RootState = {
  loggedInUserPhotos: {
    loggedInUserPhotos: responcePhotoDataWithUserInfo[];
  };
};

export const {
  setLoggedInUserPhotos,
  logoutLoggedInUserPhotos,
  addLoggedInUserPhoto,
  updateLikesPhoto,
  updateCommentsPhoto,
} = loggedInUserPhotosSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectLoggedInUserPhotos = (state: RootState) => state.loggedInUserPhotos.loggedInUserPhotos;
export default loggedInUserPhotosSlice.reducer;
