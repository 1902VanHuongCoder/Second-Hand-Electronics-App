import { combineReducers } from 'redux';
import authReducer from './store/authSlice'; // Đảm bảo đường dẫn đúng

const rootReducer = combineReducers({
  auth: authReducer,
  // Thêm các reducer khác nếu cần
});

export default rootReducer;