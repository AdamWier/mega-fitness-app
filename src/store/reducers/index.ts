import { combineReducers } from 'redux';
import { userReducer } from './User';
import { mealReducer } from './Meal';

export default combineReducers({
  user: userReducer,
  meal: mealReducer,
});
