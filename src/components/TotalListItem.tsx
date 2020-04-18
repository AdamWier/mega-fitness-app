import React from 'react';
import { Text, Divider, Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const TotalListItem: React.FC<any> = ({label, total, isBig, onValueChange, description}) => 
<View>
  <View style={styles.container}>
    <Text h4={isBig} style={styles.text}>{`${label}`}</Text>
    {onValueChange ? 
      <View style={styles.containerTight}>
        <Input 
          containerStyle={styles.inputContainer}
          onChangeText={onValueChange} 
          value={total}
          inputStyle={styles.input}
          keyboardType="number-pad"
        />
        <Text h4={isBig} style={styles.text}>{`${description}`}</Text>
      </View> 
    : <Text h4={isBig} style={styles.text}>{description ? `${total} ${description}` : total}</Text>}
  </View>
    <Divider/>
</View>

TotalListItem.propTypes = {
  label: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  isBig: PropTypes.bool,
  onValueChange: PropTypes.func,
  description: PropTypes.string,
}

TotalListItem.defaultProps = {
  isBig: false,
  onValueChange: null,
  description: '',
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerTight: {
    flexDirection: "row",
    alignItems: 'flex-end',
  },
  text: {
    margin: 10,
  },
  inputContainer: {
    width: 50,
    marginVertical: 0,
    marginHorizontal: 5,
    paddingHorizontal: 0,
  },
  input: {
    textAlign: 'center',
  }
})

export default TotalListItem;