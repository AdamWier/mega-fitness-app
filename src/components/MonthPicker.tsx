import React from 'react';
import { Text } from 'react-native-elements';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from 'react-native-elements';
import { Picker } from 'react-native';

function MonthPicker({ selectedMonth, onValueChange, theme }): JSX.Element {
  return (
    <View>
      <Text h4>Select a month</Text>
      <Picker selectedValue={selectedMonth} onValueChange={onValueChange}>
        <Picker.Item
          label="Choose a month"
          value={null}
          color={theme.colors.info}
        />
        <Picker.Item label="January" value="01" color={theme.colors.info} />
        <Picker.Item label="February" value="02" color={theme.colors.info} />
        <Picker.Item label="March" value="03" color={theme.colors.info} />
        <Picker.Item label="April" value="04" color={theme.colors.info} />
        <Picker.Item label="May" value="05" color={theme.colors.info} />
        <Picker.Item label="June" value="06" color={theme.colors.info} />
        <Picker.Item label="July" value="07" color={theme.colors.info} />
        <Picker.Item label="August" value="08" color={theme.colors.info} />
        <Picker.Item label="September" value="09" color={theme.colors.info} />
        <Picker.Item label="October" value="10" color={theme.colors.info} />
        <Picker.Item label="November" value="11" color={theme.colors.info} />
        <Picker.Item label="December" value="12" color={theme.colors.info} />
      </Picker>
    </View>
  );
}

MonthPicker.propTypes = {
  selectedMonth: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default withTheme(MonthPicker);
