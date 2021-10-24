import FoodJournal from '../../screens/FoodJournal/FoodJournal';
import Search from '../../screens/Search';
import Details from '../../screens/Details';
import Meal from '../../screens/Meal';
import BarCodeScanner from '../../screens/BarCodeScanner';
import { RouteProp } from '@react-navigation/native';
import { FoodDetails } from '../../ApiHelpers/CommonAPITypes';

export enum FoodJournalStackScreens {
  FoodJournal = 'FoodJournal',
  BarCodeScanner = 'BarCodeScanner',
  Meal = 'Meal',
  Search = 'Search',
  Details = 'Details',
}

export type FoodJournalStackParams = {
  [FoodJournalStackScreens.FoodJournal]: undefined;
  [FoodJournalStackScreens.BarCodeScanner]: undefined;
  [FoodJournalStackScreens.Meal]: undefined;
  [FoodJournalStackScreens.Search]: undefined;
  [FoodJournalStackScreens.Details]: { details: FoodDetails };
};

export default [
  {
    name: 'Food Journal',
    component: FoodJournal,
  },
  {
    name: 'BarCodeScanner',
    component: BarCodeScanner,
    options: {
      title: 'Bar Code Scanner',
    },
  },
  {
    name: 'Meal',
    component: Meal,
  },
  {
    name: 'Search',
    component: Search,
  },
  {
    name: 'Details',
    component: Details,
    options: ({
      route,
    }: {
      route: RouteProp<FoodJournalStackParams, FoodJournalStackScreens.Details>;
    }) => ({
      title: route.params.details.name,
    }),
  },
];
