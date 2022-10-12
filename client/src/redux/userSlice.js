import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    loading: false,
    error: false,
  },
  reducers: {
    startLogin: (state) => {
      state.loading = true;
    },
    successfulLogin: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    failedLogin: (state) => {
      state.loading = false;
      state.error = true;
    },

    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },

    // subscription: (state, action) => {
    //   if (!state.currentUser.subscriberedUsers.includes(action.payload)) {
    //     // not subscribed yet
    //     state.currentUser.subscriberedUsers.push(action.payload);
    //   } else {
    //     // already subscribed
    //     const idx = state.currentUser.subscriberedUsers.findIndex((user) => user === action.payload);
    //     if (idx !== -1) {
    //       state.currentUser.subscriberedUsers.splice(idx, 1);
    //     }
    //   }
    // },
  },
});

// Action creators are generated for each case reducer function
export const { startLogin, successfulLogin, failedLogin, logout } = userSlice.actions;

export default userSlice.reducer;
