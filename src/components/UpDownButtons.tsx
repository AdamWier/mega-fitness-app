import React from 'react';
import { Button, Icon, Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const UpDownButtons: React.FC<any> = ({ total, onValueChange }) => (
  <View style={styles.row}>
    <Button
      containerStyle={styles.buttonContainer}
      buttonStyle={styles.button}
      onPress={() => onValueChange(total + 1)}
      icon={<Icon name="arrow-drop-up" />}
    />
    <Button
      containerStyle={styles.buttonContainer}
      buttonStyle={styles.button}
      onPress={() => onValueChange(Math.max(total - 1, 0))}
      disabled={Number(total) <= 0}
      icon={<Icon name="arrow-drop-down" />}
    />
    <Input
      containerStyle={styles.inputContainer}
      onChangeText={(value) => onValueChange(Number(value))}
      value={total ? total.toString() : '0'}
      inputStyle={styles.input}
      keyboardType="number-pad"
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
  inputContainer: {
    width: 50,
    marginVertical: 0,
    marginHorizontal: 5,
    paddingHorizontal: 0,
  },
  input: {
    textAlign: 'center',
  },
});

export default UpDownButtons;
