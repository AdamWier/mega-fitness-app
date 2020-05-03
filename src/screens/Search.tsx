import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, SearchBar, Button, ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';
import USDAApiImpl from '../ApiHelpers/USDA/USDAApiImpl';
import OFDApiImpl from '../ApiHelpers/OFD/OFDApiImpl';
import { FoodResult, FoodDetails } from '../ApiHelpers/CommonAPITypes';
import Toast from 'react-native-simple-toast';

export default function Search({ navigation }): JSX.Element {
  const USDAapi = new USDAApiImpl();
  const OFDApi = new OFDApiImpl();

  const [searchText, updateSearchText] = useState('');
  const [results, updateResults] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (searchText) {
      setLoadingState(true);
      updateResults([
        ...(await OFDApi.search(searchText)),
        ...(await USDAapi.search(searchText)),
      ]);
      setLoadingState(false);
      updateSearchText('');
    }
  };

  const showErrorToast = () =>
    Toast.showWithGravity(
      'There was an error getting your food data',
      Toast.LONG,
      Toast.CENTER
    );

  const goToFoodDetails = async (api: string, id: string): Promise<void> => {
    try {
      let details: FoodDetails;
      switch (api) {
        case 'Open Food Data':
          details = await OFDApi.getDetails(id);
          break;
        case 'USDA':
          details = await USDAapi.getDetails(id);
          break;
        default:
          details = null;
      }

      if (details) {
        navigation.navigate('Details', { details });
      } else {
        showErrorToast();
      }
    } catch (e) {
      showErrorToast();
    }
  };

  return (
    <View>
      <Text h2>Search for a food</Text>
      <SearchBar
        value={searchText}
        onChangeText={(text): void => updateSearchText(text)}
        containerStyle={{
          marginVertical: 10,
        }}
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
        renderItem={({ item }: { item: FoodResult }): JSX.Element => (
          <ListItem
            onPress={(): Promise<void> => goToFoodDetails(item.api, item.id)}
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
