import Day from '../screens/Day';
import Search from '../screens/Search';
import Details from '../screens/Details';

export default [
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
