import FoodJournal from '../../screens/FoodJournal/FoodJournal';
import Search from '../../screens/Search';
import Details from '../../screens/Details';
import Meal from '../../screens/Meal';
import BarCodeScanner from '../../screens/BarCodeScanner';
import { RouteProp } from '@react-navigation/native';
import { FoodDetails } from '../../ApiHelpers/CommonAPITypes';
import { ComponentType } from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';

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

type DynmaicOptions = ({
  route,
}: {
  route: RouteProp<FoodJournalStackParams, FoodJournalStackScreens.Details>;
}) => StackNavigationOptions;

type Screen = {
  name: FoodJournalStackScreens;
  component: ComponentType<any>;
  options?: DynmaicOptions | ReturnType<DynmaicOptions>;
};

const screens: Screen[] = [
  {
    name: FoodJournalStackScreens.FoodJournal,
    component: FoodJournal,
  },
  {
    name: FoodJournalStackScreens.BarCodeScanner,
    component: BarCodeScanner,
    options: {
      title: 'Bar Code Scanner',
    },
  },
  {
    name: FoodJournalStackScreens.Meal,
    component: Meal,
  },
  {
    name: FoodJournalStackScreens.Search,
    component: Search,
  },
  {
    name: FoodJournalStackScreens.Details,
    component: Details,
    options: ({ route }) => ({
      title: route.params.details.name,
    }),
  },
];

export default screens;
