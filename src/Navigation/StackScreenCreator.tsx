import * as React from 'react';

export default function (Stack, screens, isLoggedIn): JSX.Element[] {
  return screens
    .filter((screen) => screen.needsLogin === isLoggedIn)
    .map((screen, index) => {
      return (
        <Stack.Screen
          name={screen.name}
          component={screen.component}
          options={screen.options}
          key={index}
        />
      );
    });
}
