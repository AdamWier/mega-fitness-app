import Day from '../screens/Day';
import Search from '../screens/Search';
import Details from '../screens/Details';
import AccountCreation from '../screens/AccountCreation';
import Login from '../screens/Login';

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
    name: 'Day',
    component: Day,
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
