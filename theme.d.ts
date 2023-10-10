// themed.d.ts
import '@rneui/themed';

declare module '@rneui/themed' {
  export interface Theme {
    colors: { [key: string]: string };
  }
}
