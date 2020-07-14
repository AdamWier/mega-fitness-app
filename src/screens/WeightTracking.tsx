import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { container } from '../store/reducers/User';
import CustomHeader from '../components/Header';
import moment from 'moment';
import { dayDocumentService } from '../Firebase/index';
import MonthPicker from '../components/MonthPicker';
import WeightGraph from '../components/WeightGraph';

function WeightTracking({ user }): JSX.Element {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [records, setRecords] = useState([]);

  const onValueChange = async (value: string) => {
    setSelectedMonth(value);
    const beginningOfMonth = moment(`2020-${value}-01`).toDate();
    const records = await dayDocumentService.findByMonth(
      beginningOfMonth,
      user.uid
    );
    setRecords(adaptRecordsForGraph(records));
  };

  const adaptRecordsForGraph = (records: { [key: string]: any }[]) =>
    records
      .filter((record) => record.weight)
      .map(({ date, weight }) => ({
        x: moment(date).format('MMM D'),
        y: weight,
      }));

  return (
    <View>
      <CustomHeader title="Weight tracking" />
      <MonthPicker
        onValueChange={onValueChange}
        selectedMonth={selectedMonth}
      />
      <WeightGraph records={records} />
    </View>
  );
}

WeightTracking.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    goalCalories: PropTypes.number,
  }).isRequired,
};

export default container(WeightTracking);
