import { Timestamp } from 'firebase/firestore';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { UserDocument } from '../../Firebase/Documents/UserDocument';

export const LOGIN = 'LOGIN';
const UPDATE_CALORIES = 'UPDATE_CALORIES';
const UPDATE_WATER_GOAL = 'UPDATE_WATER_GOAL';
const LOGOUT = 'LOGOUT';

export type UserContainerProps = ConnectedProps<typeof container>;

export interface InitialState {
  uid?: string;
  email?: string;
  updatedAt?: Timestamp;
  goalCalories: number;
  waterGoal: number;
}

export const initialState: InitialState = {
  goalCalories: 0,
  waterGoal: 0,
};

export function login(userInfo: Partial<UserDocument>): {
  type: string;
  payload: Partial<InitialState>;
} {
  return {
    type: LOGIN,
    payload: userInfo,
  };
}

export function logout(): {
  type: string;
  payload: InitialState;
} {
  return {
    type: LOGOUT,
    payload: initialState,
  };
}

export function updateCalories(goalCalories: number) {
  return {
    type: UPDATE_CALORIES,
    payload: goalCalories,
  };
}

export function updateWaterGoal(goalCalories: number) {
  return {
    type: UPDATE_WATER_GOAL,
    payload: goalCalories,
  };
}

export const userReducer = (
  state = initialState,
  action: { type: string; payload: typeof initialState }
) => {
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
    case UPDATE_WATER_GOAL:
      return {
        ...state,
        waterGoal: action.payload,
      };
    case LOGOUT:
      return action.payload;
    default:
      return state;
  }
};

const mapStateToProps = ({ user }: { user: InitialState }) => ({
  user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  storeLogin: (payload: Partial<UserDocument>): any => dispatch(login(payload)),
  storeLogout: () => dispatch(logout()),
  storeCalories: (payload: number) => dispatch(updateCalories(payload)),
  storeWaterGoal: (payload: number) => dispatch(updateWaterGoal(payload)),
});

export const container = connect(mapStateToProps, mapDispatchToProps);
