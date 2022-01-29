import * as React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Navigation from './Navigation';
import { theme } from './StyleSheet';
import store from './store';
import { LogBox } from 'react-native';

function App(): JSX.Element {
  LogBox.ignoreLogs(['Setting a timer', 'Calling `getNode()` on the ref']);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
