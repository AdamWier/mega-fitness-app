import { createStore, combineReducers } from 'redux';
import { userReducer } from './User';

const rootReducer = combineReducers({ user: userReducer });

export default createStore(rootReducer);
