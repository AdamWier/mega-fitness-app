import React from 'react';
import { Button, Text } from 'react-native-elements';
import { View, StyleSheet, StatusBar } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import OverlayWithButton from './OverlayWithButton';
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
  isGoalOverlayVisible,
  onGoalButtonPress,
  setGoalCaloriesInput,
  toggleIsGoalOverlayVisible,
  onGoalSubmit,
  isGoalOverlayLoading,
  onWeightButtonPress,
  isWeightOverlayVisible,
  toggleIsWeightOverlayVisible,
  onWeightSubmit,
  weightInput,
  setWeightInput,
  isWeightOverlayLoading,
  weight,
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
      <OverlayWithButton
        onButtonPress={onGoalButtonPress}
        isOverlayVisible={isGoalOverlayVisible}
        toggleIsOverlayVisible={toggleIsGoalOverlayVisible}
        inputValue={goalCaloriesInput}
        setInputValue={setGoalCaloriesInput}
        onConfirmButtonPress={onGoalSubmit}
        loading={isGoalOverlayLoading}
        buttonLabel={goalCalories ? 'Change your day goal' : 'Set a day goal'}
        header="How many calories for today?"
      />
      <OverlayWithButton
        onButtonPress={onWeightButtonPress}
        isOverlayVisible={isWeightOverlayVisible}
        toggleIsOverlayVisible={toggleIsWeightOverlayVisible}
        inputValue={weightInput}
        setInputValue={setWeightInput}
        onConfirmButtonPress={onWeightSubmit}
        loading={isWeightOverlayLoading}
        buttonLabel={
          weight
            ? 'Change your weight for today'
            : 'Record your weight for today'
        }
        header="How many do you weight today?"
      />
      {weight && <Text>Weight recorded today: {weight}</Text>}
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
  isGoalOverlayVisible: PropTypes.bool.isRequired,
  toggleIsGoalOverlayVisible: PropTypes.func.isRequired,
  goalCaloriesInput: PropTypes.string.isRequired,
  setGoalCaloriesInput: PropTypes.func.isRequired,
  onGoalSubmit: PropTypes.func.isRequired,
  isGoalOverlayLoading: PropTypes.bool.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      success: PropTypes.string,
      danger: PropTypes.string,
      text: PropTypes.string,
    }),
  }).isRequired,
  onWeightButtonPress: PropTypes.func.isRequired,
  isWeightOverlayVisible: PropTypes.bool.isRequired,
  toggleIsWeightOverlayVisible: PropTypes.func.isRequired,
  onWeightSubmit: PropTypes.func.isRequired,
  weightInput: PropTypes.string.isRequired,
  setWeightInput: PropTypes.func.isRequired,
  isWeightOverlayLoading: PropTypes.bool.isRequired,
  weight: PropTypes.number,
};

DayHeader.propTypes = propTypes;

type DayHeaderProps = InferProps<typeof propTypes>;

export default container(withTheme(DayHeader));
