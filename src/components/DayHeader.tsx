import React from 'react';
import { Button, Text } from 'react-native-elements';
import { View, StyleSheet, StatusBar } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import GoalOverlay from './GoalOverlay';
import { Bar } from 'react-native-progress';
import { getTotal } from '../utilities';
import { withTheme } from 'react-native-elements';
import { container } from '../store/reducers/User';

const DayHeader = ({
  goalCalories,
  foods,
  handleMealPress,
  getNewEatenAt,
  user,
  goalCaloriesInput,
  isOverlayVisible,
  onGoalButtonPress,
  setGoalCaloriesInput,
  toggleIsOverlayVisible,
  checkIsNumber,
  isOverlayLoading,
  theme,
}: DayHeaderProps) => {
  const totalCalories = foods ? foods.reduce(getTotal('calories'), 0) : 0;

  return (
    <View style={styles.container}>
      <Button
        title="Add a new meal"
        onPress={() =>
          handleMealPress({
            id: null,
            eatenAt: getNewEatenAt(),
            meal: [],
            name: 'Untitled',
            createdAt: new Date(),
            deleted: false,
            uid: user.uid,
          })
        }
      />
      {goalCalories ? (
        <View>
          <Bar
            style={{ alignSelf: 'center' }}
            progress={Math.min(totalCalories / goalCalories, 1)}
            color={
              totalCalories / goalCalories <= 1
                ? theme.colors.success
                : theme.colors.danger
            }
            borderColor={theme.colors.text}
            height={15}
            width={250}
          />
          <Text>
            {totalCalories} out of {goalCalories} calories eaten
          </Text>
        </View>
      ) : null}
      <GoalOverlay
        goalCalories={goalCaloriesInput}
        isOverlayVisible={isOverlayVisible}
        onGoalButtonPress={onGoalButtonPress}
        setGoalCalories={setGoalCaloriesInput}
        toggleIsOverlayVisible={toggleIsOverlayVisible}
        onConfirmButtonPress={checkIsNumber}
        loading={isOverlayLoading}
        hasGoal={!!goalCalories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
  },
});

const propTypes = {
  goalCalories: PropTypes.number,
  foods: PropTypes.array,
  handleMealPress: PropTypes.func.isRequired,
  getNewEatenAt: PropTypes.func.isRequired,
  user: PropTypes.shape({ uid: PropTypes.string, email: PropTypes.string })
    .isRequired,
  onGoalButtonPress: PropTypes.func.isRequired,
  isOverlayVisible: PropTypes.bool.isRequired,
  toggleIsOverlayVisible: PropTypes.func.isRequired,
  goalCaloriesInput: PropTypes.string.isRequired,
  setGoalCaloriesInput: PropTypes.func.isRequired,
  checkIsNumber: PropTypes.func.isRequired,
  isOverlayLoading: PropTypes.bool.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      success: PropTypes.string,
      danger: PropTypes.string,
      text: PropTypes.string,
    }),
  }).isRequired,
};

DayHeader.propTypes = propTypes;

type DayHeaderProps = InferProps<typeof propTypes>;

export default container(withTheme(DayHeader));
