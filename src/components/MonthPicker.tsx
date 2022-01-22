import React from 'react';
import { Text } from 'react-native-elements';
import { View } from 'react-native';
import { withTheme } from 'react-native-elements';
import { Picker } from 'react-native';
import { MyTheme } from '../StyleSheet';

function MonthPicker({
  selectedMonth,
  onValueChange,
  theme,
}: MonthPickerProps) {
  return (
    <View>
      <Text h4>Select a month</Text>
      <Picker selectedValue={selectedMonth} onValueChange={onValueChange}>
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

interface MonthPickerProps {
  selectedMonth: string;
  onValueChange: (value: any) => void;
  theme: MyTheme;
}

export default withTheme(MonthPicker);
