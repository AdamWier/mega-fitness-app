import FoodJournalStack from '../FoodJournalStack';
import GoalSetPage from '../../screens/GoalSetPage';
import WeeklyReport from '../../screens/WeeklyReport';
import WeightTracking from '../../screens/WeightTracking';

export default [
  {
    name: 'Food Journal',
    component: FoodJournalStack,
  },
  {
    name: 'GoalSetPage',
    component: GoalSetPage,
    options: {
      title: 'Set a calorie goal',
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
];
