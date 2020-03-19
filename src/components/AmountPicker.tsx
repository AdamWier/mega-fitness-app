import React from 'react';
import { Picker } from "react-native";
import { withTheme } from 'react-native-elements';

function AmountPicker({ amounts, theme, selectedValue, onValueChange }) {
    return(
        <Picker 
            prompt="Choose your measurement"
            selectedValue={selectedValue}
            onValueChange={(value) => onValueChange(value)}
        >
            {amounts.map(({description}, index) => {
                const label = description.charAt(0).toUpperCase() + description.substring(1);
                return <Picker.Item 
                    color={theme.colors.danger} 
                    label={label} 
                    value={description} 
                    key={index} 
                />
            })}
        </Picker>
    )
};

export default withTheme(AmountPicker);