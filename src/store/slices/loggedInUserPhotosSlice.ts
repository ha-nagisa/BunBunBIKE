import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responcePhotoDataWithUserInfo } from '../../models/responceData';

interface UpdatePhotoActionType {
  docId: string;
  title: string;
  description: string;
  workImageUrl: string;
  category: string;
  workMoney: string;
  workHours: string;
}

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

interface updateLoggeInUserNameActionType {
  username: string;
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
    updatePhoto: (state, action: PayloadAction<UpdatePhotoActionType>) => {
      state.loggedInUserPhotos = state.loggedInUserPhotos.map((userPhoto) => {
        if (userPhoto.docId === action.payload.docId) {
          userPhoto.title = action.payload.title;
          userPhoto.description = action.payload.description;
          userPhoto.imageSrc = action.payload.workImageUrl;
          userPhoto.category = action.payload.category;
          userPhoto.workMoney = action.payload.workMoney;
          userPhoto.workHours = action.payload.workHours;
        }
        return userPhoto;
      });
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
    updateLoggeInUserName: (state, action: PayloadAction<updateLoggeInUserNameActionType>) => {
      state.loggedInUserPhotos = state.loggedInUserPhotos.map((photo) => {
        if (photo.comments.some((com) => com.displayName === photo.username)) {
          photo.comments = photo.comments.map((com) => {
            if (com.displayName === photo.username) {
              com.displayName = action.payload.username;
            }
            return com;
          });
        }
        photo.username = action.payload.username;
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
  updatePhoto,
  addLoggedInUserPhoto,
  updateLikesPhoto,
  updateCommentsPhoto,
  updateLoggeInUserName,
} = loggedInUserPhotosSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectLoggedInUserPhotos = (state: RootState) => state.loggedInUserPhotos.loggedInUserPhotos;
export default loggedInUserPhotosSlice.reducer;
