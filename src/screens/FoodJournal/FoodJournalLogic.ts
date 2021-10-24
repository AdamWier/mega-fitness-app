import moment from 'moment';
import MealDocument from '../../Firebase/Documents/MealDocument';

const reduceMealDocuments = (data: MealDocument[]) =>
  data.reduce((foodJournal, item) => {
    const { eatenAt } = item;
    const key = moment(eatenAt).format('YYYY-MM-DD');
    if (foodJournal.hasOwnProperty(key)) {
      foodJournal[key].push(item);
    } else foodJournal[key] = [item];
    return foodJournal;
  }, {} as Record<string, MealDocument[]>);

export const constructFoodJournalItems = (
  documentsToFormat: MealDocument[],
  date: Date
) => {
  if (documentsToFormat && documentsToFormat.length) {
    return reduceMealDocuments(documentsToFormat);
  } else {
    return {
      [moment(date).format('YYYY-MM-DD')]: [],
    };
  }
};

export const compareRows = (r1: MealDocument, r2: MealDocument) => {
  return (
    r1.meal.reduce((total, food) => total + food.calories, 0) !==
    r2.meal.reduce((total, food) => total + food.calories, 0)
  );
};

export const emptyDocuments = {
  meals: [],
  day: { weight: 0, water: 0 },
};
