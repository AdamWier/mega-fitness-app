import React, { useState } from 'react';
import { View, FlatList, Switch, StyleSheet } from 'react-native';
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
  const [isFranceLocale, setIsFranceLocale] = useState(true)
  const [shouldUseOFD, setShouldUseOFD] = useState(true)

  const handleSubmit = async (): Promise<void> => {
    if (searchText) {
      setLoadingState(true);
      if(shouldUseOFD){
        updateResults(await OFDApi.search(searchText, isFranceLocale));  
      }
      else {
        updateResults(await USDAapi.search(searchText));
      }
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
      <View style={styles.switchGroupContainer}>
        <Text style={styles.textContainer}>{shouldUseOFD ? 'Open Food Data' : 'USDA'}</Text>
        <Switch value={shouldUseOFD} onValueChange={setShouldUseOFD} />
        <View style={styles.emptyContainer} />
      </View>
      <View style={styles.switchGroupContainer}>
        <Text style={styles.textContainer}>{!shouldUseOFD ? 'USA' : isFranceLocale ? 'France' : 'USA'}</Text>
        <Switch value={!shouldUseOFD ? false : isFranceLocale} onValueChange={setIsFranceLocale} disabled={!shouldUseOFD}/>
        <View style={styles.emptyContainer}/>
      </View>
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

const styles = StyleSheet.create({
  switchGroupContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  }
})

Search.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
