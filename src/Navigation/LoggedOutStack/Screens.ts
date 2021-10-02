import AccountCreation from '../../screens/AccountCreation';
import Login from '../../screens/Login';

export enum LoggedOutStackScreens {
  Login = 'Login',
  AccountCreation = 'AccountCreation',
}

export type LoggedOutStackParams = {
  [LoggedOutStackScreens.Login]: undefined;
  [LoggedOutStackScreens.AccountCreation]: undefined;
};

export default [
  {
    name: LoggedOutStackScreens.Login,
    component: Login,
  },
  {
    name: LoggedOutStackScreens.AccountCreation,
    component: AccountCreation,
    options: {
      title: 'Account Creation',
    },
  },
];
