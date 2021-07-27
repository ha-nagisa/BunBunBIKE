import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responceUserData } from '../../models/responceData';

export const suggestionProfilesSlice = createSlice({
  name: 'suggestionProfiles',
  initialState: {
    suggestionProfiles: [
      {
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
        docId: '',
      },
    ] as responceUserData[],
  },
  reducers: {
    setSuggestionProfile: (state, action: PayloadAction<responceUserData[]>) => {
      state.suggestionProfiles = action.payload;
    },
  },
});

type RootState = {
  suggestionProfiles: {
    suggestionProfiles: responceUserData[];
  };
};

export const { setSuggestionProfile } = suggestionProfilesSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectUser = (state: RootState) => state.suggestionProfiles.suggestionProfiles;
export default suggestionProfilesSlice.reducer;
