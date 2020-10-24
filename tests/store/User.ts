import {
  LOGIN,
  login,
  userReducer,
  initalState,
} from '../../src/store/reducers/User';

describe('user reducer', () => {
  it('should create an action to store user info', () => {
    expect.assertions(1);
    const payload = { uid: '1', email: 'nigthcrawler@xmen.com' };
    const expectedAction = {
      type: LOGIN,
      payload,
    };
    expect(login(payload)).toStrictEqual(expectedAction);
  });

  it('should return the initial state', () => {
    expect.assertions(1);
    expect(userReducer(undefined, {} as any)).toStrictEqual(initalState);
  });

  it('should store new user information', () => {
    expect.assertions(1);
    const payload = { uid: '2', email: 'gambit@xmen.com' };
    expect(
      userReducer(initalState, {
        type: LOGIN,
        payload,
      })
    ).toStrictEqual(payload);
  });
});
