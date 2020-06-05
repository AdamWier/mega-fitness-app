import Agenda from '../../screens/Agenda';
import Search from '../../screens/Search';
import Details from '../../screens/Details';
import Meal from '../../screens/Meal';
import BarCodeScanner from '../../screens/BarCodeScanner';

export default [
  {
    name: 'Agenda',
    component: Agenda,
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
    options: ({ route }): { [key: string]: string } => ({
      title: route.params.details.name,
    }),
  },
];
