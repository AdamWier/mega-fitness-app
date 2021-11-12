import {
  UPDATE_MEAL_DOCUMENT,
  updateMealDocument,
  mealReducer,
  initialState,
} from '../../src/store/reducers/MealDocument';

const payload = [
  {
    calories: 100,
    carbs: 10,
    fats: 5,
    name: 'Mystery Meat',
    protein: 20,
    portionDescription: 'gram',
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
    expect(mealReducer(undefined, [] as any)).toStrictEqual(initialState);
  });

  it('should store new user information', () => {
    expect.assertions(1);
    expect(
      mealReducer(initialState, {
        type: UPDATE_MEAL_DOCUMENT,
        payload,
      })
    ).toStrictEqual(payload);
  });
});
