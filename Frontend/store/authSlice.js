import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userToken: null,
    userData: null,
    isLoading: true,
  },
  reducers: {
    login: (state, action) => {
      state.userToken = action.payload.token;
      state.userData = action.payload.user;
      state.isLoading = false;
    },
    logout: (state) => {
      state.userToken = null;
      state.userData = null;
      state.isLoading = false;
    },
    register: (state, action) => {
      state.userToken = action.payload.token;
      state.userData = action.payload.user;
      state.isLoading = false;
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer; 