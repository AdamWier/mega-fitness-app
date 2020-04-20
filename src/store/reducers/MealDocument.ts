import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const UPDATE_MEAL_DOCUMENT = 'UPDATE_MEAL_DOCUMENT';

const initalState = [];

function updateMealDocument(mealDocument: any): { type: string; payload: any } {
  return {
    type: UPDATE_MEAL_DOCUMENT,
    payload: mealDocument,
  };
}

export const mealReducer = (
  state = initalState,
  action: { type: string; payload: any }
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
