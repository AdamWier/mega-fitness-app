import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { CalendarList } from 'react-native-calendars';


export default function CalendarView({ navigation }): JSX.Element {

    const goToDayScreen = (timestamp: number): void => {
        const date = new Date(timestamp);
        navigation.navigate('Day', {date});
    }

    return (
        <View>
        <CalendarList 
            onDayPress={(day) => goToDayScreen(day.timestamp)}
            firstDay={1}
        />
        </View>
  );
}

CalendarView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};