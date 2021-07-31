import AccountCreation from '../../screens/AccountCreation';
import Login from '../../screens/Login';

export type LoggedOutStackParams = {
  Login: undefined;
  ['Account Creation']: undefined;
};

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
