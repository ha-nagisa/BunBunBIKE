import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responcePhotoDataWithUserInfo } from '../../models/responceData';

export const photoDetailModalSlice = createSlice({
  name: 'photoDetaile',
  initialState: {
    photoDetaile: {
      maker: 'HONDA',
      carModel: 'GB350',
      category: 'ドレスアップ',
      comments: [{}],
      dateCreated: 0,
      description: 'テストです。',
      imageSrc: '',
      likes: [''],
      title: 'テスト',
      userId: '',
      workHours: '',
      workMoney: '',
      userLikedPhoto: false,
      username: '',
    } as responcePhotoDataWithUserInfo,
    isModalOpen: false,
  },
  reducers: {
    setPhotoDetail: (state, action: PayloadAction<responcePhotoDataWithUserInfo>) => {
      state.photoDetaile = action.payload;
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

export const { setPhotoDetail, setIsModalOpen } = photoDetailModalSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectPhotoDetaile = (state: RootState) => state.photoDetaile.photoDetaile;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectIsModalOpen = (state: RootState) => state.photoDetaile.isModalOpen;
export default photoDetailModalSlice.reducer;
