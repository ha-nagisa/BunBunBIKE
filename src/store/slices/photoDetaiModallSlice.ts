import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responcePhotoDataWithUserInfo } from '../../models/responceData';

export const photoDetailModalSlice = createSlice({
  name: 'photoDetail',
  initialState: {
    photoDetail: {
      carModel: '',
      category: '',
      comments: [],
      dateCreated: 0,
      description: '',
      docId: '',
      imageSrc: '',
      likes: [],
      maker: '',
      title: '',
      userId: '',
      userLikedPhoto: false,
      username: '',
      workHours: '',
      workMoney: '',
    } as responcePhotoDataWithUserInfo,
    isModalOpen: false,
  },
  reducers: {
    setPhotoDetail: (state, action: PayloadAction<responcePhotoDataWithUserInfo>) => {
      state.photoDetail = action.payload;
    },
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
});

type RootState = {
  photoDetaile: {
    photoDetaile: responcePhotoDataWithUserInfo;
    isModalOpen: boolean;
  };
};

export const { setPhotoDetail } = photoDetailModalSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectPhotoDetaile = (state: RootState) => state.photoDetaile.photoDetaile;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectModalOpen = (state: RootState) => state.photoDetaile.isModalOpen;
export default photoDetailModalSlice.reducer;
