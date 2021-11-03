import FoodJournal from '../../screens/FoodJournal/FoodJournal';
import Search from '../../screens/Search';
import Details from '../../screens/Details';
import Meal from '../../screens/Meal';
import BarCodeScanner from '../../screens/BarCodeScanner';
import { FoodDetails } from '../../ApiHelpers/CommonAPITypes';
import { Screen } from '../index';
import { StackNavigationOptions } from '@react-navigation/stack';

export enum FoodJournalStackScreenNames {
  FoodJournal = 'Food Journal',
  BarCodeScanner = 'Bar Code Scanner',
  Meal = 'Meal',
  Search = 'Search',
  Details = 'Details',
}

export type FoodJournalStackParams = {
  [FoodJournalStackScreenNames.FoodJournal]: undefined;
  [FoodJournalStackScreenNames.BarCodeScanner]: undefined;
  [FoodJournalStackScreenNames.Meal]: undefined;
  [FoodJournalStackScreenNames.Search]: undefined;
  [FoodJournalStackScreenNames.Details]: { details: FoodDetails };
};

type FoodJournalStackScreen = Screen<
  FoodJournalStackScreenNames,
  FoodJournalStackParams,
  StackNavigationOptions
>;

const screens: FoodJournalStackScreen[] = [
  {
    name: FoodJournalStackScreenNames.FoodJournal,
    component: FoodJournal,
  },
  {
    name: FoodJournalStackScreenNames.BarCodeScanner,
    component: BarCodeScanner,
    options: {
      title: 'Bar Code Scanner',
    },
  },
  {
    name: FoodJournalStackScreenNames.Meal,
    component: Meal,
  },
  {
    name: FoodJournalStackScreenNames.Search,
    component: Search,
  },
  {
    name: FoodJournalStackScreenNames.Details,
    component: Details,
    options: ({ route }) => ({
      title: route.params?.details.name,
    }),
  },
];

export default screens;
