import FoodJournalStack from '../FoodJournalStack';
import GoalSetPage from '../../screens/GoalSetPage';
import WeeklyReport from '../../screens/WeeklyReport';
import WeightTracking from '../../screens/WeightTracking/WeightTracking';
import ShoppingList from '../../screens/ShoppingList';
import { Screen } from '../index';
import { DrawerNavigationOptions } from '@react-navigation/drawer';

export enum LoggedInDrawerScreenNames {
  FoodJournal = 'Food Journal',
  GoalSetPage = 'Goal Set Page',
  WeeklyReports = 'Weekly Reports',
  WeightTracking = 'Weight Tracking',
  ShoppingLists = 'Shopping Lists',
}

export type LoggedInDrawerParams = Record<
  LoggedInDrawerScreenNames,
  undefined | object
>;

type LoggedInDrawerScreen = Screen<
  LoggedInDrawerScreenNames,
  LoggedInDrawerParams,
  DrawerNavigationOptions
>;

const screens: LoggedInDrawerScreen[] = [
  {
    name: LoggedInDrawerScreenNames.FoodJournal,
    component: FoodJournalStack,
  },
  {
    name: LoggedInDrawerScreenNames.GoalSetPage,
    component: GoalSetPage,
    options: {
      title: 'Set goals',
    },
  },
  {
    name: LoggedInDrawerScreenNames.WeeklyReports,
    component: WeeklyReport,
  },
  {
    name: LoggedInDrawerScreenNames.WeightTracking,
    component: WeightTracking,
  },
  {
    name: LoggedInDrawerScreenNames.ShoppingLists,
    component: ShoppingList,
  },
];

export default screens;
