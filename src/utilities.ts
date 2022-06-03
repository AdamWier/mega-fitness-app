import moment from 'moment';

export const findMax = (past: number, current: number) =>
  Math.max(past, current);

export const findMin = (past: number, current: number) =>
  Math.min(past, current);

export const getTotal =
  (nutrient: string) =>
  (accumulator: number, currentValue: { [key: string]: any }): number =>
    accumulator + currentValue[nutrient];

export function createWeeklyReport(
  mealDocuments: { [key: string]: any }[],
  dayDocuments: { [key: string]: any }[]
) {
  const mealCaloriesTotalReducer = (
    accum: number,
    next: { [key: string]: any }
  ) => accum + next.calories;

  const dayCaloriesTotalReducer = (
    accum: { [key: string]: any },
    next: { [key: string]: any }
  ) => {
    const dayString = moment(next.eatenAt).startOf('day').format('ddd');
    if (accum.hasOwnProperty(dayString)) {
      accum[dayString] = next.meal.reduce(
        mealCaloriesTotalReducer,
        accum[dayString]
      );
    } else {
      accum[dayString] = next.meal.reduce(mealCaloriesTotalReducer, 0);
    }
    return accum;
  };

  const dayCalorieGoalReducer = (
    accum: { [key: string]: any },
    next: { [key: string]: any }
  ) => {
    const dayString = moment(next.date).startOf('day').format('ddd');
    accum[dayString] = next.goalCalories;
    return accum;
  };

  const totalNutrientsReducer = (
    accum: { [key: string]: number },
    next: { [key: string]: number }
  ) => {
    accum.calories += next.calories;
    accum.protein += next.protein;
    accum.carbs += next.carbs;
    accum.fats += next.fats;
    return accum;
  };

  const createTotalCardData = (mealsDocs: { [key: string]: any }[]) => {
    const totals = mealsDocs
      .flatMap((document: { [key: string]: any }) => document.meal)
      .reduce(totalNutrientsReducer, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      });

    const mealTotalsGroupedByDay = mealsDocs.reduce(
      dayCaloriesTotalReducer,
      {}
    );

    for (const nutrient in totals) {
      totals[nutrient] = Math.round(
        totals[nutrient] / Object.keys(mealTotalsGroupedByDay).length
      );
    }

    return totals;
  };

  const createGraphData = (
    mealsDocs: { [key: string]: any }[],
    dayDocs: { [key: string]: any }[]
  ) => {
    const mealTotalsGroupedByDay = mealsDocs.reduce(
      dayCaloriesTotalReducer,
      {}
    );

    const dayDocumentsRegrouped = dayDocs.reduce(dayCalorieGoalReducer, {});

    const days = Array.from(
      new Set([
        ...Object.keys(mealTotalsGroupedByDay),
        ...Object.keys(dayDocumentsRegrouped),
      ])
    );

    return days.map((day) => ({
      day,
      eaten: mealTotalsGroupedByDay[day] || 0,
      goal: dayDocumentsRegrouped[day] || 0,
    }));
  };

  return {
    averages: createTotalCardData(mealDocuments),
    graphData: createGraphData(mealDocuments, dayDocuments),
  };
}
