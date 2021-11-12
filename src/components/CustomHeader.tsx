import React from 'react';
import { Header, Button, Icon, Text } from 'react-native-elements';
import { Alert, StyleSheet, StatusBar } from 'react-native';
import { authService } from '../Firebase';
import { container, UserContainerProps } from '../store/reducers/User';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

function CustomHeader({
  title,
  storeLogout,
}: CustomHeaderProps & UserContainerProps) {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  const logout = () => {
    Alert.alert('Log out', 'Do you want to log out?', [
      { text: 'No', onPress: () => null },
      {
        text: 'Yes',
        onPress: () => {
          authService.logout();
          storeLogout();
        },
      },
    ]);
  };

  return (
    <Header
      style={style.headerPadding}
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
          {title}
        </Text>
      }
      placement="left"
      rightComponent={
        <Button icon={<Icon name={'power-settings-new'} />} onPress={logout} />
      }
    />
  );
}

const style = StyleSheet.create({
  headerPadding: {
    paddingTop: StatusBar.currentHeight,
  },
});

interface CustomHeaderProps {
  title: string;
}

export default container(CustomHeader);
