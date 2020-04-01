import * as React from 'react';

export default function(Stack, screens){
    const [meal, updateMeal] = React.useState([]);

    return screens.map((screen, index) => {
        // Temporary solution until adding context or redux
        if(screen.props){
            return <Stack.Screen name={screen.name} key={index} >
                {props => <screen.component {...props} meal={meal} updateMeal={updateMeal} options={screen.options} />}
            </Stack.Screen>
        }
        return <Stack.Screen name={screen.name} component={screen.component} options={screen.options} key={index} />
    })
}