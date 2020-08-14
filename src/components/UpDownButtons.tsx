import React from 'react';
import { Button, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const UpDownButtons: React.FC<any> = ({ total, onValueChange }) => (
  <View style={styles.row}>
    <Button
      containerStyle={styles.buttonContainer}
      buttonStyle={styles.button}
      onPress={() => onValueChange((Number(total) + 1).toString())}
      icon={<Icon name="arrow-drop-up" />}
    />
    <Button
      containerStyle={styles.buttonContainer}
      buttonStyle={styles.button}
      onPress={() => onValueChange(Math.max(Number(total) - 1, 0).toString())}
      disabled={Number(total) <= 0}
      icon={<Icon name="arrow-drop-down" />}
    />
  </View>
);

UpDownButtons.propTypes = {
  total: PropTypes.number.isRequired,
  onValueChange: PropTypes.func,
};

UpDownButtons.defaultProps = {
  onValueChange: null,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  button: {
    margin: 0,
    padding: 0,
  },
});

export default UpDownButtons;
