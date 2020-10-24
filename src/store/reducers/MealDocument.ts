import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AddedFood } from '../../Firebase/Documents/MealDocument';

export const UPDATE_MEAL_DOCUMENT = 'UPDATE_MEAL_DOCUMENT';

export const initialState = [];

export function updateMealDocument(
  mealDocument: AddedFood[]
): { type: string; payload: AddedFood[] } {
  return {
    type: UPDATE_MEAL_DOCUMENT,
    payload: mealDocument,
  };
}

export const mealReducer = (
  state = initialState,
  action: { type: string; payload: AddedFood[] }
): { [key: string]: any } => {
  switch (action.type) {
    case UPDATE_MEAL_DOCUMENT:
      return action.payload;
    default:
      return state;
  }
};

const mapStateToProps = (state: {
  [key: string]: any;
}): { [key: string]: any } => ({
  mealDocument: state.mealDocument,
});

const mapDispatchToProps = (dispatch: Dispatch): { [key: string]: any } => ({
  updateMealDocument: (payload: Array<any>): any =>
    dispatch(updateMealDocument(payload)),
});

export const container = connect(mapStateToProps, mapDispatchToProps);
