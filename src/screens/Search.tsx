import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  Text, SearchBar, Button, ListItem,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import USDAApiImpl from '../ApiHelpers/USDA/USDAApiImpl';

export default function Search({ navigation }): JSX.Element {
  const USDAapi = new USDAApiImpl();

  const [searchText, updateSearchText] = useState('');
  const [results, updateResults] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (searchText) {
      setLoadingState(true);
      updateResults(await USDAapi.search(searchText));
      setLoadingState(false);
      updateSearchText('');
    }
  };

  const goToFoodDetails = async (id: number): Promise<void> => {
    const details = await USDAapi.getDetails(id);
    navigation.navigate('Details', { details });
  };

  return (
    <View>
      <Text h1>Search for food</Text>
      <SearchBar
        value={searchText}
        onChangeText={(text): void => updateSearchText(text)}
      />
      <Button
        type={!searchText ? 'outline' : 'solid'}
        disabled={!searchText}
        loading={loadingState}
        raised
        title="Search"
        onPress={(): Promise<void> => handleSubmit()}
      />
      <FlatList
        data={results}
        keyExtractor={(item, index): string => index.toString()}
        renderItem={({ item }): JSX.Element => (
          <ListItem
            onPress={(): Promise<void> => goToFoodDetails(item.fdcId)}
            title={item.description}
          />
        )}
      />
    </View>
  );
}

Search.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
