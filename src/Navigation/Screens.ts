import Day from '../screens/Day';
import Search from '../screens/Search';
import Details from '../screens/Details';
import AccountCreation from '../screens/AccountCreation';

export default [
  {
    name: 'AccountCreation',
    component: AccountCreation,
    options: {
      title: 'Account Creation',
    },
  },
  {
    name: 'Day',
    component: Day,
    props: true,
  },
  {
    name: 'Search',
    component: Search,
  },
  {
    name: 'Details',
    component: Details,
    props: true,
    options: ({ route }): { [key: string]: string } => ({
      title: route.params.details.name,
    }),
  },
];
