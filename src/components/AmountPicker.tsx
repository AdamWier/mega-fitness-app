import React from 'react';
import { Picker } from 'react-native';
import { withTheme } from 'react-native-elements';
import { MyTheme } from '../StyleSheet';

function AmountPicker({
  amounts,
  theme,
  selectedValue,
  onValueChange,
}: AmountPickerProps) {
  return (
    <Picker
      prompt="Choose your measurement"
      selectedValue={selectedValue}
      onValueChange={onValueChange}
    >
      {amounts.map(({ description }, index) => {
        const label =
          description.charAt(0).toUpperCase() + description.substring(1);
        return (
          <Picker.Item
            color={theme.colors.info}
            label={`${label} ⏬`}
            value={description}
            key={index}
          />
        );
      })}
    </Picker>
  );
}

interface AmountPickerProps {
  amounts: any[];
  theme: MyTheme;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default withTheme(AmountPicker);
