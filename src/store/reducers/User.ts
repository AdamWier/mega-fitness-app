import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PropTypes from 'prop-types';
import { UserDocument } from '../../Firebase/Documents/UserDocument';

export const LOGIN = 'LOGIN';
const UPDATE_CALORIES = 'UPDATE_CALORIES';

export const initialState = {
  uid: null,
  email: null,
  goalCalories: 0,
};

export function login(
  userInfo: UserDocument
): { type: string; payload: typeof initialState } {
  return {
    type: LOGIN,
    payload: userInfo,
  };
}

export function updateCalories(goalCalories: number) {
  return {
    type: UPDATE_CALORIES,
    payload: goalCalories,
  };
}

export const userReducer = (
  state = initialState,
  action: { type: string; payload: typeof initialState }
): { [key: string]: any } => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_CALORIES:
      return {
        ...state,
        goalCalories: action.payload,
      };
    default:
      return state;
  }
};

const mapStateToProps = (state: {
  [key: string]: any;
}): { [key: string]: any } => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch): { [key: string]: any } => ({
  storeLogin: (payload: UserDocument): any => dispatch(login(payload)),
  storeCalories: (payload: number) => dispatch(updateCalories(payload)),
});

export const container = connect(mapStateToProps, mapDispatchToProps);

export const UserPropTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    goalCalories: PropTypes.number,
  }).isRequired,
};
