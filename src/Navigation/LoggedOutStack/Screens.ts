import AccountCreation from '../../screens/AccountCreation';
import Login from '../../screens/Login';

export default [
  {
    name: 'Login',
    component: Login,
  },
  {
    name: 'Account Creation',
    component: AccountCreation,
    options: {
      title: 'Account Creation',
    },
  },
];
