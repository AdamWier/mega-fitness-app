import React from 'react';
import { Button, Text, Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import OverlayWithButton from './OverlayWithButton';
import { Bar } from 'react-native-progress';
import { getTotal } from '../utilities';
import { withTheme } from 'react-native-elements';
import { container } from '../store/reducers/User';
import UpDownButtons from './UpDownButtons';
import { AddedFood } from '../Firebase/Documents/MealDocument';
import { MyTheme } from '../StyleSheet';
import { UserContainerProps } from '../store/reducers/User';

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
  waterGoal,
  todaysWater,
  updateWaterGoal,
}: DayHeaderProps) => {
  const totalCalories = foods ? foods.reduce(getTotal('calories'), 0) : 0;

  return (
    <View>
      <View style={styles.buttonsContainer}>
        <Button
          containerStyle={styles.buttonContainer}
          icon={<Icon name="add-circle" />}
          onPress={() =>
            user.uid &&
            handleMealPress({
              id: '',
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
      {!!waterGoal && (
        <View style={styles.statusBarContainer}>
          <View style={styles.waterGoalContainer}>
            <UpDownButtons
              total={todaysWater}
              onValueChange={updateWaterGoal}
              hideInput={true}
            />
            <Bar
              style={{ flexShrink: 1, alignSelf: 'center' }}
              progress={Math.min(todaysWater / waterGoal, 1)}
              color={theme.colors.info}
              borderColor={theme.colors.text}
              height={15}
              width={250}
            />
          </View>
          <Text>
            {todaysWater} glasses out of {waterGoal} drunk
          </Text>
        </View>
      )}
      {!!goalCalories && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  buttonContainer: { flexGrow: 1 },
  statusBarContainer: { padding: 10 },
  waterGoalContainer: { flexDirection: 'row' },
});

type DayHeaderProps = {
  goalCalories?: number;
  foods: AddedFood[];
  handleMealPress: (meal: any) => void;
  getNewEatenAt: () => Date;
  onGoalButtonPress: () => void;
  isGoalOverlayVisible: boolean;
  toggleIsGoalOverlayVisible: (value: boolean) => void;
  goalCaloriesInput: string;
  setGoalCaloriesInput: (value: string) => void;
  onGoalSubmit: () => void;
  isGoalOverlayLoading: boolean;
  clearGoal: () => void;
  theme: MyTheme;
  onWeightButtonPress: () => void;
  isWeightOverlayVisible: boolean;
  toggleIsWeightOverlayVisible: (value: boolean) => void;
  onWeightSubmit: () => void;
  weightInput: string;
  setWeightInput: (value: string) => void;
  isWeightOverlayLoading: boolean;
  weight?: number;
  waterGoal?: number;
  todaysWater: number;
  updateWaterGoal: (value: number) => void;
} & UserContainerProps;

export default container(withTheme(DayHeader));
