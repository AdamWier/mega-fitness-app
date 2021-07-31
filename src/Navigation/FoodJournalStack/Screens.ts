import FoodJournal from '../../screens/FoodJournal';
import Search from '../../screens/Search';
import Details from '../../screens/Details';
import Meal from '../../screens/Meal';
import BarCodeScanner from '../../screens/BarCodeScanner';
import { RouteProp } from '@react-navigation/native';
import { FoodDetails } from '../../ApiHelpers/CommonAPITypes';

export type FoodJournalStackParams = {
  ['Food Journal']: undefined;
  BarCodeScanner: undefined;
  Meal: undefined;
  Search: undefined;
  Details: { details: FoodDetails };
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
      route: RouteProp<FoodJournalStackParams, 'Details'>;
    }) => ({
      title: route.params.details.name,
    }),
  },
];
