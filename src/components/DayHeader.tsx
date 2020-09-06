import React from 'react';
import { Button, Text, Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
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
  clearGoal,
}: DayHeaderProps) => {
  const totalCalories = foods ? foods.reduce(getTotal('calories'), 0) : 0;

  return (
    <View>
      <View style={styles.buttonsContainer}>
        <Button
          containerStyle={styles.buttonContainer}
          icon={<Icon name="add-circle" />}
          onPress={() =>
            handleMealPress({
              id: null,
              eatenAt: getNewEatenAt(),
              meal: [],
              name: '',
              createdAt: new Date(),
              deleted: false,
              uid: user.uid,
            })
          }
        />
        <View style={styles.buttonContainer}>
          <OverlayWithButton
            onButtonPress={onGoalButtonPress}
            isOverlayVisible={isGoalOverlayVisible}
            toggleIsOverlayVisible={toggleIsGoalOverlayVisible}
            inputValue={goalCaloriesInput}
            setInputValue={setGoalCaloriesInput}
            onConfirmButtonPress={onGoalSubmit}
            loading={isGoalOverlayLoading}
            icon={<Icon type="font-awesome" name="clipboard" />}
            header="Calorie goal for the day"
            onClear={clearGoal}
          />
        </View>
        <View style={styles.buttonContainer}>
          <OverlayWithButton
            onButtonPress={onWeightButtonPress}
            isOverlayVisible={isWeightOverlayVisible}
            toggleIsOverlayVisible={toggleIsWeightOverlayVisible}
            inputValue={weightInput}
            setInputValue={setWeightInput}
            onConfirmButtonPress={onWeightSubmit}
            loading={isWeightOverlayLoading}
            icon={<Icon type="font-awesome" name="balance-scale" />}
            header="Weight recorded today"
          />
        </View>
      </View>
      {!!weight && <Text>Weight recorded today: {weight}</Text>}
      {goalCalories ? (
        <View style={styles.statusBarContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  buttonContainer: { flexGrow: 1 },
  statusBarContainer: { padding: 10 },
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
  clearGoal: PropTypes.func.isRequired,
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
