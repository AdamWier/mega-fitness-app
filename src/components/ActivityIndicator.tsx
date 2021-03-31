import React from 'react';
import { ActivityIndicator as AI } from 'react-native';
import { withTheme } from 'react-native-elements';
import PropTypes, { InferProps } from 'prop-types';

function ActivityIndicator({
  theme,
  size,
}: InferProps<typeof ActivityIndicator.propTypes>) {
  return <AI size={size} color={theme.colors.success} />;
}

ActivityIndicator.propTypes = {
  size: PropTypes.oneOf([PropTypes.number, 'small', 'large']),
  theme: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withTheme(ActivityIndicator);
