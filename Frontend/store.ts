import { createStore } from 'redux';
import rootReducer from './reducers'; // Đảm bảo đường dẫn này là chính xác

const store = createStore(rootReducer);

export default store; 