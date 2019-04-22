import { createStore } from 'redux';
import LoginReducer from '../reducers/loginReducer'

const store = createStore(LoginReducer);

export default store;