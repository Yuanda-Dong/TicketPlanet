import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchContent: null,
  },
  reducers: {
    updateContent: (state, action) => {
      state.searchContent = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateContent } = searchSlice.actions;

export default searchSlice.reducer;
