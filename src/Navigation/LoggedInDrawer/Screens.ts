import FoodJournalStack from '../FoodJournalStack';
import GoalSetPage from '../../screens/GoalSetPage';
import WeeklyReport from '../../screens/WeeklyReport';
import WeightTracking from '../../screens/WeightTracking';
import ShoppingList from '../../screens/ShoppingList';

export enum LoggedInDrawerScreens {
  FoodJournal = 'FoodJournal',
  GoalSetPage = 'GoalSetPage',
  WeeklyReports = 'WeeklyReports',
  WeightTracking = 'WeightTracking',
  ShoppingLists = 'ShoppingLists',
}

export type LoggedInDrawerParams = {
  [LoggedInDrawerScreens.FoodJournal]: undefined;
  [LoggedInDrawerScreens.GoalSetPage]: undefined;
  [LoggedInDrawerScreens.WeeklyReports]: undefined;
  [LoggedInDrawerScreens.WeightTracking]: undefined;
  [LoggedInDrawerScreens.ShoppingLists]: undefined;
};

export default [
  {
    name: LoggedInDrawerScreens.FoodJournal,
    component: FoodJournalStack,
  },
  {
    name: LoggedInDrawerScreens.GoalSetPage,
    component: GoalSetPage,
    options: {
      title: 'Set goals',
    },
  },
  {
    name: LoggedInDrawerScreens.WeeklyReports,
    component: WeeklyReport,
  },
  {
    name: LoggedInDrawerScreens.WeightTracking,
    component: WeightTracking,
  },
  {
    name: LoggedInDrawerScreens.ShoppingLists,
    component: ShoppingList,
  },
];
