import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchContent,
  },
  reducers: {
    updateContent: (state, action) => {
      state.content = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateContent } = searchSlice.actions;

export default searchSlice.reducer;
