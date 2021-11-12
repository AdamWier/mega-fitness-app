import { connect } from 'react-redux';
import { Dispatch } from 'redux';

export const UPDATE_MEAL_DOCUMENT = 'UPDATE_MEAL_DOCUMENT';

export const initialState = {
  mealDocument: undefined as any,
};

export function updateMealDocument(mealDocument: any) {
  return {
    type: UPDATE_MEAL_DOCUMENT,
    payload: mealDocument,
  };
}

export const mealReducer = (
  state = initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case UPDATE_MEAL_DOCUMENT:
      return action.payload;
    default:
      return state;
  }
};

const mapStateToProps = (state: typeof initialState) => ({
  mealDocument: state.mealDocument,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateMealDocument: (payload: any) => dispatch(updateMealDocument(payload)),
});

export type MealContainerProps = typeof initialState &
  ReturnType<typeof mapDispatchToProps>;

export const container = connect(mapStateToProps, mapDispatchToProps);
