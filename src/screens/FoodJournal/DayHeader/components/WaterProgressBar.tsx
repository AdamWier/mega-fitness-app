import React from 'react';
import { Text, useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { Bar } from 'react-native-progress';
import { container } from '../../../../store/reducers/User';
import UpDownButtons from '../../../../components/UpDownButtons';
import { UserContainerProps } from '../../../../store/reducers/User';

const WaterProgressBar = ({
  user,
  todaysWater,
  updateWaterGoal,
}: WaterProgressBarProps) => {
  const { theme } = useTheme();
  return (
    <View style={styles.statusBarContainer}>
      <View style={styles.waterGoalContainer}>
        <UpDownButtons
          total={todaysWater}
          onValueChange={updateWaterGoal}
          hideInput={true}
        />
        {!!user.waterGoal && (
          <Bar
            style={{ flexShrink: 1, alignSelf: 'center' }}
            progress={Math.min(todaysWater / user.waterGoal, 1)}
            color={theme.colors.info}
            borderColor={theme.colors.text}
            height={15}
            width={250}
          />
        )}
      </View>
      <Text>
        {todaysWater} glasses out of {user.waterGoal} drunk
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBarContainer: { padding: 10 },
  waterGoalContainer: { flexDirection: 'row', justifyContent: 'center' },
});

type WaterProgressBarProps = {
  todaysWater: number;
  updateWaterGoal: (value: number) => void;
} & UserContainerProps;

export default container(WaterProgressBar);
