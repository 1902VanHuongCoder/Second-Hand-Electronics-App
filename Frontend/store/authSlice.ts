import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import socket from '@/utils/socket';
import rootURL from "@/utils/backendRootURL";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  token?: string; // Add token as an optional property
  avatarUrl?: string | null;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async action for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ phone, password }: { phone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(`${rootURL}/api/login`, { phone, password });
      await AsyncStorage.setItem('token', response.data.token);
      
      // Trả về cả token và thông tin người dùng
      return {
        user: response.data.user,
        token: response.data.token
      };
      
    } catch (error) {
      return rejectWithValue((error as any).response?.data.message || 'Đăng nhập thất bại');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({name, phone, password }: { name: string, phone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(`${rootURL}/api/signup`, { name, phone, password });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data.message || 'Đăng ký thất bại');
    }
  }
);

// Async action for updating user information
export const updateUser = createAsyncThunk<User, User>(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put<{message: String, success: boolean, user:User}>(`${rootURL}/api/update`, userData, {
        headers: {
          'Authorization': `Bearer ${userData.token}`, // Ensure token is included if it exists
        },
      });
      console.log("before return", response.data);  
      return response.data.user; // Return user data from server

    } catch (error) {
      return rejectWithValue((error as any).response?.data.message || 'Cập nhật thất bại');
    }
  }
);

// Async action to check token and load user data
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      // Gọi API để lấy thông tin người dùng từ token
      const response = await axios.get<User>(`${rootURL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return {
        user: response.data,
        token
      };
    } catch (error) {
      await AsyncStorage.removeItem('token'); // Xóa token nếu không hợp lệ
      return rejectWithValue((error as any).response?.data?.message || 'Authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('token');
      socket.disconnect(); 
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          ...action.payload.user,
          token: action.payload.token
        };
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      // Xử lý loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          ...action.payload.user,
          token: action.payload.token // Đảm bảo token được lưu trong user
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled,(state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; // Cập nhật thông tin người dùng
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
