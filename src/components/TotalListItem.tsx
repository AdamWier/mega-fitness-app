import React from 'react';
import { Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import UpDownButtons from './UpDownButtons';

const TotalListItem: React.FC<any> = ({
  label,
  total,
  onValueChange,
  description,
  isColumn,
}) => (
  <View style={isColumn ? styles.containerColumn : styles.containerRow}>
    <Text style={styles.text}>{`${label}`}</Text>
    {onValueChange ? (
      <View style={styles.containerTight}>
        <UpDownButtons total={Number(total)} onValueChange={onValueChange} />
        <Text style={styles.text}>{`${description}`}</Text>
      </View>
    ) : (
      <Text style={styles.text}>
        {description
          ? `${total} ${description}`
          : label.includes('Calories')
          ? total
          : `${total} g`}
      </Text>
    )}
  </View>
);

TotalListItem.propTypes = {
  label: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  onValueChange: PropTypes.func,
  description: PropTypes.string,
};

TotalListItem.defaultProps = {
  onValueChange: null,
  description: '',
};

const styles = StyleSheet.create({
  containerRow: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerColumn: {
    justifyContent: 'space-between',
  },
  containerTight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    margin: 3,
  },
  amountChangerContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  amountChanger: {
    margin: 0,
    padding: 0,
  },
});

export default TotalListItem;
