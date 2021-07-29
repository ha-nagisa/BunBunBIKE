import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responceUserData } from '../../models/responceData';

export const suggestionProfilesSlice = createSlice({
  name: 'suggestionProfiles',
  initialState: {
    suggestionProfiles: [] as responceUserData[],
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
export const selectSuggestionProfiles = (state: RootState) => state.suggestionProfiles.suggestionProfiles;
export default suggestionProfilesSlice.reducer;
