import React, { useEffect, useCallback, ComponentType } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { navTheme } from '../StyleSheet';
import { container } from '../store/reducers/User';
import { authService } from '../Firebase';
import LoggedOutStack from './LoggedOutStack';
import LoggedInDrawer from './LoggedInDrawer';
import { UserDocument } from '../Firebase/Documents/UserDocument';
import { UserContainerProps } from '../store/reducers/User';

type DynmaicOptions<
  NavigationParams extends Record<string, object | undefined>,
  NavigationOptions
> = ({
  route,
}: {
  route: RouteProp<NavigationParams, keyof NavigationParams>;
}) => NavigationOptions;

export type Screen<
  ScreensEnum,
  NavigationParams extends Record<string, object | undefined>,
  NavigationOptions
> = {
  name: ScreensEnum;
  component: ComponentType<any>;
  options?:
    | DynmaicOptions<NavigationParams, NavigationOptions>
    | ReturnType<DynmaicOptions<NavigationParams, NavigationOptions>>;
};

function Navigation({ user, storeLogin }: {} & UserContainerProps) {
  const getCurrentUserCallback = useCallback(
    async () =>
      await authService.getCurrentUser((receivedUser: UserDocument) => {
        if (receivedUser) {
          storeLogin(receivedUser);
        }
      }),
    [storeLogin]
  );

  useEffect(() => {
    // Do not unsubscribe or we'll lose the user
    getCurrentUserCallback();
  }, [getCurrentUserCallback]);

  return (
    <NavigationContainer theme={navTheme}>
      {user.uid ? <LoggedInDrawer /> : <LoggedOutStack />}
    </NavigationContainer>
  );
}

export default container(Navigation);
