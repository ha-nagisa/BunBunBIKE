import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responcePhotoDataWithUserInfo } from '../../models/responceData';

export const loggedInUserPhotosSlice = createSlice({
  name: 'loggedInUserPhotos',
  initialState: {
    loggedInUserPhotos: [
      {
        maker: '',
        carModel: '',
        category: '',
        comments: [''],
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
    ] as responcePhotoDataWithUserInfo[],
  },
  reducers: {
    setLoggedInUserPhotos: (state, action: PayloadAction<responcePhotoDataWithUserInfo[]>) => {
      state.loggedInUserPhotos = action.payload;
    },
    addLoggedInUserPhoto: (state, action: PayloadAction<responcePhotoDataWithUserInfo>) => {
      state.loggedInUserPhotos = [...state.loggedInUserPhotos, action.payload];
    },
  },
});

type RootState = {
  loggedInUserPhotos: {
    loggedInUserPhotos: responcePhotoDataWithUserInfo[];
  };
};

export const { setLoggedInUserPhotos, addLoggedInUserPhoto } = loggedInUserPhotosSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectUser = (state: RootState) => state.loggedInUserPhotos.loggedInUserPhotos;
export default loggedInUserPhotosSlice.reducer;
