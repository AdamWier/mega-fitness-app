import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, Divider, Card, ListItem, withTheme } from 'react-native-elements';
import FoodCard from '../components/FoodCard';

const getTotal = (nutrient) => {
    return (accumulator, currentValue) => accumulator + currentValue[nutrient];
}

function Day({ navigation, theme, meal }){

    const getTotals = () => {
        const calories = meal.reduce(getTotal('calories'), 0);
        const protein = meal.reduce(getTotal('protein'), 0);
        const carbs = meal.reduce(getTotal('carbs'), 0);
        const fats = meal.reduce(getTotal('fats'), 0);
        return {
            calories,
            protein,
            carbs,
            fats,
        }
    }

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
            {meal.length ?
                <View>
                    <Divider />
                    <Card 
                        containerStyle={{
                            backgroundColor: theme.colors.primary,
                            marginBottom: 20
                        }}
                        title="Totals"
                    >
                        <ListItem
                            title="Calories:"
                            subtitle={getTotals().calories.toString()}
                            chevron={false}
                            containerStyle={{
                                backgroundColor: theme.colors.primary,
                                borderRadius: 15,
                                padding: 10,
                            }}
                        />
                        <ListItem
                            title="Protein:"
                            subtitle={getTotals().protein.toString()}
                            chevron={false}
                            containerStyle={{
                                backgroundColor: theme.colors.grey0,
                                borderRadius: 15,
                                padding: 10,
                            }}
                        />
                        <ListItem
                            title="Carbs:"
                            subtitle={getTotals().carbs.toString()}
                            chevron={false}
                            containerStyle={{
                                backgroundColor: theme.colors.primary,
                                borderRadius: 15,
                                padding: 10,
                            }}
                        />
                        <ListItem
                            title="Fat:"
                            subtitle={getTotals().fats.toString()}
                            chevron={false}
                            containerStyle={{
                                backgroundColor: theme.colors.grey0,
                                borderRadius: 15,
                                padding: 10,
                            }}
                        />
                    </Card>
                </View>
            : null }
        </ScrollView>
    )
}

export default withTheme(Day);