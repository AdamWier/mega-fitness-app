import React from 'react';
import { Text, Icon, Tooltip } from 'react-native-elements';
import { View, StyleSheet, Switch } from 'react-native';
import PropTypes from 'prop-types';

const SwitchGroup = ({
  switchText,
  value,
  onValueChange,
  toolTipText,
  toolTipHeight,
  iconName,
}) => (
  <View style={styles.switchGroupContainer}>
    <View style={styles.emptyContainer} />
    {switchText ? <Text style={styles.textContainer}>{switchText}</Text> : null}
    <Switch value={value} onValueChange={onValueChange} />
    {toolTipText && iconName ? (
      <Tooltip height={toolTipHeight} popover={<Text>{toolTipText}</Text>}>
        <Icon containerStyle={styles.icon} name={iconName} />
      </Tooltip>
    ) : null}
    <View style={styles.emptyContainer} />
  </View>
);

SwitchGroup.propTypes = {
  switchText: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
  toolTipText: PropTypes.string,
  toolTipHeight: PropTypes.number,
  iconName: PropTypes.string,
};

SwitchGroup.defaultProps = {
  switchText: null,
  toolTipText: null,
  toolTipHeight: null,
  iconName: null,
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  switchGroupContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 2,
  },
  emptyContainer: {
    flex: 1,
  },
  icon: {
    marginHorizontal: 15,
  },
});

export default SwitchGroup;
