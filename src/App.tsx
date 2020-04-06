import * as React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import Navigation from './Navigation';
import { theme } from './StyleSheet';
import store from './store';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
