import React from 'react';
import { withTheme, Text, Divider } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const TotalListItem: React.FC<any> = ({label, total, isBig}) => 
<View>
  <View style={styles.container}>
    <Text h4={isBig} style={styles.text}>{`${label}`}</Text>
    <Text h4={isBig} style={styles.text}>{total}</Text>
  </View>
    <Divider/>
</View>

TotalListItem.propTypes = {
  label: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  isBig: PropTypes.bool
}

TotalListItem.defaultProps = {
  isBig: false
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    margin: 10
  },
})

export default TotalListItem;