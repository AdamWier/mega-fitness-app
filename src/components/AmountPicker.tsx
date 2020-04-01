import React from 'react';
import { Picker } from 'react-native';
import { withTheme } from 'react-native-elements';
import PropTypes from 'prop-types';

function AmountPicker({
  amounts,
  theme,
  selectedValue,
  onValueChange,
}): JSX.Element {
  return (
    <Picker
      prompt="Choose your measurement"
      selectedValue={selectedValue}
      onValueChange={(value): void => onValueChange(value)}
    >
      {amounts.map(({ description }, index) => {
        const label =
          description.charAt(0).toUpperCase() + description.substring(1);
        return (
          <Picker.Item
            color={theme.colors.danger}
            label={label}
            value={description}
            key={index}
          />
        );
      })}
    </Picker>
  );
}

AmountPicker.propTypes = {
  amounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default withTheme(AmountPicker);
