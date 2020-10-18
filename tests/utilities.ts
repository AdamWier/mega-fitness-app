import { createWeeklyReport } from '../src/utilities';

describe('weekly report utils', () => {
  const mealDocuments = [
    {
      id: '1',
      eatenAt: new Date(2020, 8, 10, 6, 0, 0),
      name: 'Breakfast',
      meal: [
        {
          amount: 1,
          calories: 10,
          carbs: 5,
          fats: 0,
          protein: 0,
          portionDescription: 'packet',
          name: 'Coffee',
        },
        {
          amount: 80,
          calories: 900,
          carbs: 45,
          fats: 20,
          protein: 85,
          portionDescription: 'spoonful',
          name: 'Nameless sludge',
        },
        {
          amount: 50,
          calories: 185,
          carbs: 40,
          fats: 0,
          protein: 30,
          portionDescription: 'cubes',
          name: 'Soylent Green',
        },
      ],
    },
    {
      id: '2',
      eatenAt: new Date(2020, 8, 10, 20, 30, 0),
      name: 'Dinner',
      meal: [
        {
          amount: 1,
          calories: 10,
          carbs: 5,
          fats: 0,
          protein: 0,
          portionDescription: 'glass',
          name: 'Wine',
        },
        {
          amount: 80,
          calories: 900,
          carbs: 45,
          fats: 20,
          protein: 85,
          portionDescription: 'spoonful',
          name: 'Nameless sludge',
        },
        {
          amount: 5,
          calories: 15,
          carbs: 0,
          fats: 80,
          protein: 2,
          portionDescription: 'cups',
          name: 'Slush-o',
        },
      ],
    },
    {
      id: '3',
      eatenAt: new Date(2020, 8, 11, 8, 15, 0),
      name: 'Lunch',
      meal: [
        {
          amount: 1,
          calories: 10,
          carbs: 5,
          fats: 0,
          protein: 0,
          name: 'Coffee',
          portionDescription: 'packet',
        },
        {
          amount: 50,
          calories: 185,
          carbs: 40,
          fats: 0,
          protein: 30,
          portionDescription: 'cubes',
          name: 'Soylent Green',
        },
      ],
    },
    {
      id: '4',
      eatenAt: new Date(2020, 8, 11, 20, 30, 0),
      name: 'Dinner',
      meal: [
        {
          amount: 15,
          calories: 100,
          carbs: 60,
          fats: 0,
          protein: 0,
          portionDescription: 'thimble',
          name: 'Arsenic',
        },
        {
          amount: 80,
          calories: 900,
          carbs: 45,
          fats: 20,
          protein: 85,
          portionDescription: 'spoonful',
          name: 'Nameless sludge',
        },
        {
          amount: 5,
          calories: 15,
          carbs: 0,
          fats: 80,
          protein: 2,
          portionDescription: 'cups',
          name: 'Slush-o',
        },
      ],
    },
  ];

  const dayDocuments = [
    {
      id: '4',
      goalCalories: 2000,
      date: new Date(2020, 8, 10),
      weight: 50,
    },
    {
      id: '5',
      goalCalories: 2000,
      date: new Date(2020, 8, 11),
      weight: 52,
    },
    {
      id: '6',
      goalCalories: 1800,
      date: new Date(2020, 8, 12),
      weight: 50,
    },
  ];

  it('correctly averages the documents', () => {
    expect.assertions(4);
    const result = createWeeklyReport(mealDocuments, dayDocuments);
    const { calories, carbs, protein, fats } = result.averages;
    expect(calories).toBe(1615);
    expect(carbs).toBe(145);
    // Non-rounded value is 159.5
    expect(protein).toBe(160);
    expect(fats).toBe(110);
  });

  it('correctly organizes the graph data object', () => {
    expect.assertions(1);
    const { graphData } = createWeeklyReport(mealDocuments, dayDocuments);
    expect(graphData).toStrictEqual([
      {
        day: 'Thu',
        eaten: 2020,
        goal: 2000,
      },
      {
        day: 'Fri',
        eaten: 1210,
        goal: 2000,
      },
      {
        day: 'Sat',
        eaten: 0,
        goal: 1800,
      },
    ]);
  });
});
