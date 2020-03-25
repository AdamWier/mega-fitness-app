import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import FoodCard from '../components/FoodCard';

export default function Day({ navigation, meal }){

    const today = new Date();
    const title = today.toLocaleString('en');
    navigation.setOptions({ title });

    return(
        <ScrollView>
            {
                meal.length ? 
                    meal.map((food, index) =>
                        <FoodCard 
                            name={food.name} 
                            portion={food.portion} 
                            calories={food.calories}
                            protein={food.protein} 
                            carbs={food.carbs} 
                            fats={food.fats} 
                            children={null}
                            key={index}
                        />
                    ) : 
                <Text>
                    No foods added to this meal
                </Text>
            }
            <Button 
                title="Add a food" 
                onPress={() => navigation.navigate("Search")} 
            />
        </ScrollView>
    )
}