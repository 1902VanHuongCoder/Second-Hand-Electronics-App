import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define types
interface User {
  id: string;
  name: string;
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
      const response = await axios.post<{ token: any; user: User }>('http://10.0.2.2:5000/api/login', { phone, password });
      
       await AsyncStorage.setItem('token', response.data.token);
     console.log(response.data.token)
      return response.data;
    } catch (error) {  
      console.log(error );
      return rejectWithValue((error as any).response?.data.message || 'Đăng nhập thất bại');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ phone, password }: { phone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ token: string; user: User }>('http://10.0.2.2:5000/api/signup', { phone, password });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data.message || 'Đăng ký thất bại');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ phone: string; password: string }>) => {
      // Xử lý đăng nhập
    },
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
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
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
      });
  },
});

export const { login: loginAction, logout } = authSlice.actions;
export default authSlice.reducer;
