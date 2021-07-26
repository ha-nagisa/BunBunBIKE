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
  },
  reducers: {
    setPhotoDetail: (state, action: PayloadAction<responcePhotoDataWithUserInfo>) => {
      state.photoDetail = action.payload;
    },
  },
});

type RootState = {
  photoDetaile: {
    photoDetaile: responcePhotoDataWithUserInfo;
  };
};

export const { setPhotoDetail } = photoDetailModalSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectUser = (state: RootState) => state.photoDetaile.photoDetaile;
export default photoDetailModalSlice.reducer;
