import React from 'react';
import { ActivityIndicator as AI } from 'react-native';
import { useTheme, withTheme } from '@rneui/themed';

function ActivityIndicator({ size }: ActivityIndicatorProps) {
  const { theme } = useTheme();
  return <AI size={size} color={theme.colors.success} />;
}

interface ActivityIndicatorProps {
  size?: number | 'small' | 'large';
}

export default withTheme(ActivityIndicator);
