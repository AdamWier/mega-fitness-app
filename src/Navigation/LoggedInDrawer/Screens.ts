import FoodJournalStack from '../FoodJournalStack';
import GoalSetPage from '../../screens/GoalSetPage';
import WeeklyReport from '../../screens/WeeklyReport';
import WeightTracking from '../../screens/WeightTracking';
import ShoppingList from '../../screens/ShoppingList';

export type LoggedInDrawerParams = {
  ['Food Journal']: undefined;
  GoalSetPage: undefined;
  ['Weekly Reports']: undefined;
  ['Weight tracking']: undefined;
  ['Shopping Lists']: undefined;
};

export default [
  {
    name: 'Food Journal',
    component: FoodJournalStack,
  },
  {
    name: 'GoalSetPage',
    component: GoalSetPage,
    options: {
      title: 'Set goals',
    },
  },
  {
    name: 'Weekly Reports',
    component: WeeklyReport,
  },
  {
    name: 'Weight tracking',
    component: WeightTracking,
  },
  {
    name: 'Shopping Lists',
    component: ShoppingList,
  },
];
