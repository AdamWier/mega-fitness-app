import React from 'react';
import { Header, Button, Icon, Text } from 'react-native-elements';
import { Alert } from 'react-native';
import { authService } from '../Firebase';
import { container, UserProps } from '../store/reducers/User';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

function CustomHeader({ storeLogin }: UserProps) {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  const logout = () => {
    Alert.alert('Log out', 'Do you want to log out?', [
      { text: 'No', onPress: () => null },
      {
        text: 'Yes',
        onPress: () => {
          authService.logout();
          storeLogin({ uid: null, email: null });
        },
      },
    ]);
  };

  return (
    <Header
      leftComponent={
        <Button
          icon={<Icon name={'menu'} />}
          onPress={() => navigation.toggleDrawer()}
        />
      }
      centerComponent={
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'sans-serif-medium',
          }}
        >
          Settings
        </Text>
      }
      placement="left"
      rightComponent={
        <Button icon={<Icon name={'power-settings-new'} />} onPress={logout} />
      }
    />
  );
}

export default container(CustomHeader);
