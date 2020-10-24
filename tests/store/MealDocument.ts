import {
  UPDATE_MEAL_DOCUMENT,
  updateMealDocument,
  mealReducer,
  initalState,
} from '../../src/store/reducers/MealDocument';

const payload = [
  {
    calories: 100,
    carbs: 10,
    fats: 5,
    name: 'Mystery Meat',
    protein: 20,
    portionDiscription: 'gram',
    amount: 10,
  },
];

describe('user reducer', () => {
  it('should create an action to store the new meal document', () => {
    expect.assertions(1);
    const expectedAction = {
      type: UPDATE_MEAL_DOCUMENT,
      payload,
    };
    expect(updateMealDocument(payload)).toStrictEqual(expectedAction);
  });

  it('should return the initial state', () => {
    expect.assertions(1);
    expect(mealReducer(undefined, [] as any)).toStrictEqual(initalState);
  });

  it('should store new user information', () => {
    expect.assertions(1);
    expect(
      mealReducer(initalState, {
        type: UPDATE_MEAL_DOCUMENT,
        payload,
      })
    ).toStrictEqual(payload);
  });
});
