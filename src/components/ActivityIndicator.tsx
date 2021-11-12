import React from 'react';
import { ActivityIndicator as AI } from 'react-native';
import { withTheme } from 'react-native-elements';
import { MyTheme } from '../StyleSheet';

function ActivityIndicator({ theme, size }: ActivityIndicatorProps) {
  return <AI size={size} color={theme.colors.success} />;
}

interface ActivityIndicatorProps {
  size?: number | 'small' | 'large';
  theme: MyTheme;
}

export default withTheme(ActivityIndicator);
