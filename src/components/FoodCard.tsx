import React from 'react';
import { Card } from '@rneui/themed';
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
  expanded,
  children,
}: FoodCardProps) {
  return (
    <Card>
      <Card.Title>{name}</Card.Title>
      <TotalListItem
        label="Calories:"
        total={calories}
        chevron={true}
        onValueChange={onCalorieChange}
      />
      {expanded ? (
        <View>
          <TotalListItem label="Protein:" total={protein} chevron={false} />
          <TotalListItem label="Carbs:" total={carbs} chevron={false} />
          <TotalListItem label="Fat:" total={fats} chevron={false} />
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
  expanded: boolean;
  children?: React.ReactNode;
}
