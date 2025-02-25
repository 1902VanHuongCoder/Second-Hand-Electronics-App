import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  token?: string; // Add token as an optional property
  avatarUrl?: string | null;
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
      const response = await axios.post<{ token: string; user: User }>('http://10.0.2.2:5000/api/login', { phone, password });
      await AsyncStorage.setItem('token', response.data.token);
      console.log("Response data", response.data.user); 
      return response.data.user; // Trả về thông tin người dùng
      
    } catch (error) {
      return rejectWithValue((error as any).response?.data.message || 'Đăng nhập thất bại');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({name, phone, password }: { name: string, phone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ token: string; user: User }>('http://10.0.2.2:5000/api/signup', { name, phone, password });
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
      const response = await axios.put<{message: String, success: boolean, user:User}>(`http://10.0.2.2:5000/api/update`, userData, {
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; // Cập nhật thông tin người dùng
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
