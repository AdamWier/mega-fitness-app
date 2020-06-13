import FoodJournalStack from '../FoodJournalStack';
import Settings from '../../screens/Settings';
import WeeklyReport from '../../screens/WeeklyReport';

export default [
  {
    name: 'Food Journal',
    component: FoodJournalStack,
  },
  {
    name: 'Settings',
    component: Settings,
  },
  {
    name: 'Weekly Reports',
    component: WeeklyReport,
  },
];
