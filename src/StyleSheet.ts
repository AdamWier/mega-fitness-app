import { Theme } from 'react-native-elements';
import { DefaultTheme } from '@react-navigation/native';

interface MyTheme extends Theme {
  colors: {[key: string]: string}
}

export const theme = {
  Text: {
    style: {
      color: '#ffffff',
      textAlign: 'center'
    }
  },
  Button: {
    buttonStyle: {
      backgroundColor: '#375a7f',
      borderRadius: 10,
    },
    containerStyle: {
      margin: 10,
      backgroundColor: '#222222'
    } 
  },
  ListItem: {
    titleStyle: {
      textAlign: 'left',
    },
    subtitleStyle: {
      color: '#ffffff',
      textAlign: 'right',
    },
    containerStyle: {backgroundColor: '#222222'},
    chevron: true,
    bottomDivider: true,
  },
  Card: {
    containerStyle: {
      backgroundColor: '#222222'
    },
    titleStyle: {
      color: '#ffffff'
    }
  },
  colors: {
    backgroundColor: '#222222'
  }
} as MyTheme;

export const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.backgroundColor
  }
}