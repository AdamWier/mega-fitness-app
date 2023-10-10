import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { useTheme, withTheme } from '@rneui/themed';

function AmountPicker({
  amounts,
  selectedValue,
  onValueChange,
}: AmountPickerProps) {
  const { theme } = useTheme();
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
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default withTheme(AmountPicker);
