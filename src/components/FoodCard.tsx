import React from 'react';
import { Card, Input } from 'react-native-elements';
import { View } from 'react-native';
import TotalListItem from '../components/TotalListItem';

export default function FoodCard({
  name,
  calories,
  protein,
  carbs,
  fats,
  amount,
  amountDescription,
  onAmountChange,
  onCalorieChange,
  onNameChange,
  onProteinChange,
  onCarbsChange,
  onFatsChange,
  expanded,
  children,
}: FoodCardProps) {
  return (
    <Card
      title={onNameChange && <Input value={name} onChangeText={onNameChange} />}
    >
      <TotalListItem
        label="Calories:"
        total={calories}
        chevron={true}
        onValueChange={onCalorieChange}
      />
      {expanded ? (
        <View>
          <TotalListItem
            label="Protein:"
            total={protein}
            chevron={false}
            onValueChange={onProteinChange}
          />
          <TotalListItem
            label="Carbs:"
            total={carbs}
            chevron={false}
            onValueChange={onCarbsChange}
          />
          <TotalListItem
            label="Fat:"
            total={fats}
            chevron={false}
            onValueChange={onFatsChange}
          />
        </View>
      ) : null}
      {amount !== null ? (
        <TotalListItem
          label="Amount:"
          total={amount}
          description={amountDescription}
          chevron={false}
          onValueChange={onAmountChange}
        />
      ) : null}
      {children}
    </Card>
  );
}

interface FoodCardProps {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  amount?: string;
  amountDescription?: string;
  onAmountChange?: (value: string) => void;
  onCalorieChange?: (value: string) => void;
  onNameChange?: (value: string) => void;
  onProteinChange?: (value: string) => void;
  onCarbsChange?: (value: string) => void;
  onFatsChange?: (value: string) => void;
  expanded: boolean;
  children?: React.ReactNode;
}
