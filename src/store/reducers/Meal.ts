import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const UPDATE_MEAL = 'UPDATE_MEAL';

const initalState = [];

function updateMeal(newMeal: Array<any>): { type: string; payload: any } {
  return {
    type: UPDATE_MEAL,
    payload: newMeal,
  };
}

export const mealReducer = (
  state = initalState,
  action: { type: string; payload: any }
): { [key: string]: any } => {
  switch (action.type) {
    case UPDATE_MEAL:
      return [...action.payload];
    default:
      return state;
  }
};

const mapStateToProps = (state: {
  [key: string]: any;
}): { [key: string]: any } => ({
  meal: state.meal,
});

const mapDispatchToProps = (dispatch: Dispatch): { [key: string]: any } => ({
  updateMeal: (payload: Array<any>): any => dispatch(updateMeal(payload)),
});

export const container = connect(mapStateToProps, mapDispatchToProps);
