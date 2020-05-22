import Agenda from '../screens/Agenda';
import Search from '../screens/Search';
import Details from '../screens/Details';
import AccountCreation from '../screens/AccountCreation';
import Login from '../screens/Login';
import Meal from '../screens/Meal';
import BarCodeScanner from '../screens/BarCodeScanner';

export default [
  {
    name: 'Login',
    component: Login,
    needsLogin: false,
  },
  {
    name: 'AccountCreation',
    component: AccountCreation,
    options: {
      title: 'Account Creation',
    },
    needsLogin: false,
  },
  {
    name: 'Agenda',
    component: Agenda,
    needsLogin: true,
  },
  {
    name: 'BarCodeScanner',
    component: BarCodeScanner,
    options: {
      title: 'Bar Code Scanner',
    },
    needsLogin: true,
  },
  {
    name: 'Meal',
    component: Meal,
    needsLogin: true,
  },
  {
    name: 'Search',
    component: Search,
    needsLogin: true,
  },
  {
    name: 'Details',
    component: Details,
    options: ({ route }): { [key: string]: string } => ({
      title: route.params.details.name,
    }),
    needsLogin: true,
  },
];
