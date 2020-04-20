import { combineReducers } from 'redux';
import { userReducer } from './User';
import { mealReducer } from './MealDocument';

export default combineReducers({
  user: userReducer,
  mealDocument: mealReducer,
});
