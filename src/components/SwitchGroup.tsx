import React from 'react';
import { Text, Icon, Tooltip } from 'react-native-elements';
import { View, StyleSheet, Switch } from 'react-native';

const SwitchGroup = ({
  switchText,
  value,
  onValueChange,
  toolTipText,
  toolTipHeight,
  iconName,
}: SwitchGroupProps) => (
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

interface SwitchGroupProps {
  switchText: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  toolTipText: string;
  toolTipHeight: number;
  iconName: string;
}

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
