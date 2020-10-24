import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PropTypes from 'prop-types';

export const LOGIN = 'LOGIN';

export const initalState = {
  uid: null,
  email: null,
};

export function login(userInfo: {
  uid: string;
  email: string;
}): { type: string; payload: typeof initalState } {
  return {
    type: LOGIN,
    payload: userInfo,
  };
}

export const userReducer = (
  state = initalState,
  action: { type: string; payload: typeof initalState }
): { [key: string]: any } => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        ...action.payload,
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
  storeLogin: (payload: { uid: string; email: string }): any =>
    dispatch(login(payload)),
});

export const container = connect(mapStateToProps, mapDispatchToProps);

export const UserPropTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    goalCalories: PropTypes.number,
  }).isRequired,
};
