import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import MealDocument from '../../Firebase/Documents/MealDocument';

export const UPDATE_MEAL_DOCUMENT = 'UPDATE_MEAL_DOCUMENT';

export const initialState: Partial<MealDocument> = {};

export function updateMealDocument(mealDocument: MealDocument) {
  return {
    type: UPDATE_MEAL_DOCUMENT,
    payload: mealDocument,
  };
}

export const mealReducer = (
  state = initialState,
  action: { type: string; payload: MealDocument }
) => {
  switch (action.type) {
    case UPDATE_MEAL_DOCUMENT:
      return action.payload;
    default:
      return state;
  }
};

const mapStateToProps = (state: any) => ({
  mealDocument: state.mealDocument,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateMealDocument: (payload: MealDocument) =>
    dispatch(updateMealDocument(payload)),
});

export type MealContainerProps = MealDocument &
  ReturnType<typeof mapDispatchToProps>;

export const container = connect(mapStateToProps, mapDispatchToProps);
