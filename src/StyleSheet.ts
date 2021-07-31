import { Theme } from 'react-native-elements';
import { DefaultTheme } from '@react-navigation/native';

export interface MyTheme extends Theme {
  colors: { [key: string]: string };
}

const colors = {
  ...DefaultTheme.colors,
  text: '#ffffff',
  primary: '#375a7f',
  background: '#222222',
  success: '#00bc8c',
  danger: '#E74C3C',
  grey0: '#adb5bd',
  warning: '#F39C12',
  info: '#3498DB',
};

export const navTheme = {
  ...DefaultTheme,
  colors,
};

export const theme: MyTheme = {
  Text: {
    style: {
      color: colors.text,
      textAlign: 'center',
    },
  },
  Button: {
    buttonStyle: {
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
    containerStyle: {
      margin: 10,
      backgroundColor: colors.background,
    },
  },
  ListItem: {
    titleStyle: {
      textAlign: 'left',
    },
    subtitleStyle: {
      color: colors.text,
      textAlign: 'left',
    },
    containerStyle: {
      backgroundColor: colors.background,
    },
    chevron: true,
    bottomDivider: true,
  },
  Card: {
    containerStyle: {
      backgroundColor: colors.background,
    },
    titleStyle: {
      color: colors.text,
    },
  },
  Slider: {
    thumbTintColor: colors.success,
  },
  Input: {
    containerStyle: {
      backgroundColor: colors.text,
      marginVertical: 10,
      marginHorizontal: 20,
      width: 300,
      padding: 0,
    },
  },
  SearchBar: {
    inputStyle: {
      color: colors.text,
    },
    containerStyle: {
      backgroundColor: colors.background,
    },
    inputContainerStyle: {
      borderRadius: 0,
    },
  },
  Icon: {
    color: colors.text,
  },
  Tooltip: {
    withOverlay: false,
  },
  Overlay: {
    overlayStyle: { backgroundColor: colors.background },
    borderRadius: 10,
  },
  Header: {
    containerStyle: {
      height: 56,
      borderBottomColor: 'transparent',
      paddingTop: 0,
      paddingHorizontal: 0,
    },
  },
  colors,
};
