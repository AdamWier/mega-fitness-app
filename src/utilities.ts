import moment from 'moment';
import MealDocument from './Firebase/Documents/MealDocument';
import DayDocument from './Firebase/Documents/DayDocument';

export const getTotal = (nutrient: string) => (
  accumulator: number,
  currentValue: { [key: string]: any }
): number => accumulator + currentValue[nutrient];

export function createWeeklyReport(
  mealDocuments: MealDocument[],
  dayDocuments: DayDocument[]
) {
  const mealCaloriesTotalReducer = (
    accum: number,
    next: { [key: string]: any }
  ) => accum + next.calories;

  const dayCaloriesTotalReducer = (
    accum: { [key: string]: any },
    next: { [key: string]: any }
  ) => {
    const dayString = moment(next.eatenAt).startOf('day').format('dddd');
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
    const dayString = moment(next.date).startOf('day').format('dddd');
    accum[dayString] = next.goalCalories;
    return accum;
  };

  const averageNutrientsReducer = (
    accum: { [key: string]: number },
    next: { [key: string]: number },
    index: number,
    array: []
  ) => {
    accum.calories += next.calories;
    accum.protein += next.protein;
    accum.carbs += next.carbs;
    accum.fats += next.fats;
    if (index === array.length - 1) {
      accum.calories /= array.length;
      accum.protein /= array.length;
      accum.carbs /= array.length;
      accum.fats /= array.length;
    }
    return accum;
  };

  const createTotalCardData = (mealDocuments: MealDocument[]) =>
    mealDocuments
      .flatMap((document: { [key: string]: any }) => document.meal)
      .reduce(averageNutrientsReducer, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      });

  const createGraphData = (
    mealDocuments: MealDocument[],
    dayDocuments: DayDocument[]
  ) => {
    const mealTotalsGroupedByDay = mealDocuments.reduce(
      dayCaloriesTotalReducer,
      {}
    );

    const dayDocumentsRegrouped = dayDocuments.reduce(
      dayCalorieGoalReducer,
      {}
    );

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
    totals: createTotalCardData(mealDocuments),
    graphData: createGraphData(mealDocuments, dayDocuments),
  };
}
