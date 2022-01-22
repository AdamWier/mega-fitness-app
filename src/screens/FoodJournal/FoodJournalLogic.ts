import moment from 'moment';
import DayDocument from '../../Firebase/Documents/DayDocument';
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

export const emptyDocuments = {
  meals: [] as MealDocument[],
  day: { weight: 0, water: 0 } as DayDocument,
};
