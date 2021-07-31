import React, { useEffect, useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navTheme } from '../StyleSheet';
import { container } from '../store/reducers/User';
import { authService } from '../Firebase';
import LoggedOutStack from './LoggedOutStack';
import LoggedInDrawer from './LoggedInDrawer';
import { UserDocument } from '../Firebase/Documents/UserDocument';
import { UserContainerProps } from '../store/reducers/User';

function Navigation({ user, storeLogin }: {} & UserContainerProps) {
  const [unsubscribe, setUnsubscribe] = useState<firebase.Unsubscribe>();

  const getCurrentUserCallback = useCallback(
    async () =>
      setUnsubscribe(
        await authService.getCurrentUser((receivedUser: UserDocument) => {
          if (receivedUser) {
            storeLogin(receivedUser);
          }
        })
      ),
    [storeLogin]
  );

  useEffect(() => {
    getCurrentUserCallback();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [getCurrentUserCallback, unsubscribe]);

  return (
    <NavigationContainer theme={navTheme}>
      {user.uid ? <LoggedInDrawer /> : <LoggedOutStack />}
    </NavigationContainer>
  );
}

export default container(Navigation);
