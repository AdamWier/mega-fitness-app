import * as React from 'react';
import { ThemeProvider } from 'react-native-elements';
import Navigation from './Navigation';
import { theme } from './StyleSheet';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
    </ThemeProvider>
  );
}

export default App;
