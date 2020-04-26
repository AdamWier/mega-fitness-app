import React from 'react';
import { Text, Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const TotalListItem: React.FC<any> = ({
  label,
  total,
  onValueChange,
  description,
}) => (
  <View>
    <View style={styles.container}>
      <Text style={styles.text}>{`${label}`}</Text>
      {onValueChange ? (
        <View style={styles.containerTight}>
          <Input
            containerStyle={styles.inputContainer}
            onChangeText={onValueChange}
            value={total}
            inputStyle={styles.input}
            keyboardType="number-pad"
          />
          <Text style={styles.text}>{`${description}`}</Text>
        </View>
      ) : (
        <Text style={styles.text}>
          {description ? `${total} ${description}` : total}
        </Text>
      )}
    </View>
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
  container: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerTight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    margin: 3,
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

export default TotalListItem;
