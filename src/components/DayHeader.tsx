import React from 'react';
import { Button } from 'react-native-elements';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import GoalOverlay from './GoalOverlay';

const DayHeader = ({ 
    handleMealPress, 
    getNewEatenAt, 
    user, 
    goalCaloriesInput, 
    isOverlayVisible, 
    onGoalButtonPress, 
    setGoalCaloriesInput, 
    toggleIsOverlayVisible, 
    checkIsNumber, 
    isOverlayLoading 
}) => (
    <View>
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
        <GoalOverlay
            goalCalories={goalCaloriesInput}
            isOverlayVisible={isOverlayVisible}
            onGoalButtonPress={onGoalButtonPress}
            setGoalCalories={setGoalCaloriesInput}
            toggleIsOverlayVisible={toggleIsOverlayVisible}
            onConfirmButtonPress={checkIsNumber}
            loading={isOverlayLoading}
        />
    </View>
);

DayHeader.propTypes = {
    handleMealPress: PropTypes.func.isRequired, 
    getNewEatenAt: PropTypes.func.isRequired, 
    user: PropTypes.shape({uid: PropTypes.string, email: PropTypes.string}).isRequired,
    onGoalButtonPress: PropTypes.func.isRequired,
    isOverlayVisible: PropTypes.bool.isRequired,
    toggleIsOverlayVisible: PropTypes.func.isRequired,
    goalCalories: PropTypes.string.isRequired,
    setGoalCaloriesInput: PropTypes.func.isRequired,
    checkIsNumber: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default DayHeader;