import moment from 'moment';

const reduceMealDocuments = (data: { [key: string]: any }[]) =>
  data.reduce((foodJournal, item) => {
    const { eatenAt } = item;
    const key = moment(eatenAt).format('YYYY-MM-DD');
    if (foodJournal.hasOwnProperty(key)) {
      foodJournal[key].push(item);
    } else foodJournal[key] = [item];
    return foodJournal;
  }, {});

export const constructFoodJournalItems = (
  documentsToFormat: { [key: string]: any }[],
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

export const compareRows = (
  r1: { [key: string]: any },
  r2: { [key: string]: any }
) => {
  return (
    r1.meal.reduce(
      (prev: { [key: string]: any }, next: { [key: string]: any }) =>
        prev.calories + next.calories,
      0
    ) !==
    r2.meal.reduce(
      (prev: { [key: string]: any }, next: { [key: string]: any }) =>
        prev.calories + next.calories,
      0
    )
  );
};

export const emptyDocuments = {
  meals: [],
  day: { weight: 0, water: 0 },
};
