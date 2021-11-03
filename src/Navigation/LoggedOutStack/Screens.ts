import { StackNavigationOptions } from '@react-navigation/stack';
import AccountCreation from '../../screens/AccountCreation';
import Login from '../../screens/Login';
import { Screen } from '../index';

export enum LoggedOutStackScreenNames {
  Login = 'Login',
  AccountCreation = 'Account Creation',
}

export type LoggedOutStackParams = Record<
  LoggedOutStackScreenNames,
  undefined | object
>;

type LoggedOutStackScreens = Screen<
  LoggedOutStackScreenNames,
  LoggedOutStackParams,
  StackNavigationOptions
>;

const screens: LoggedOutStackScreens[] = [
  {
    name: LoggedOutStackScreenNames.Login,
    component: Login,
  },
  {
    name: LoggedOutStackScreenNames.AccountCreation,
    component: AccountCreation,
    options: {
      title: 'Account Creation',
    },
  },
];

export default screens;
