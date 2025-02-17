import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initialState = {
  userToken: null as string | null,
  userData: {} as UserState,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string | null; user: UserState }>) => {
      state.userToken = action.payload.token;
      state.userData = action.payload.user;
      state.isLoading = false;
    },
    logout: (state) => {
      state.userToken = null;
      state.userData = {} as UserState;
      state.isLoading = false;
    },
    register: (state, action: PayloadAction<{ token: string; user: UserState }>) => {
      state.userToken = action.payload.token;
      state.userData = action.payload.user;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<{ user: UserState }>) => {
      const { user } = action.payload;
      state.userData = { ...state.userData, ...user }; // Cập nhật thông tin người dùng
    },
  },
});

// Xuất các action
export const { login, logout, register, updateUser } = authSlice.actions;

// Xuất reducer
export default authSlice.reducer; 