import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  RefObject,
} from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import {
  Text,
  SearchBar,
  Button,
  ListItem,
  Divider,
} from 'react-native-elements';
import USDAApiImpl from '../ApiHelpers/USDA/USDAApi';
import OFDApiImpl from '../ApiHelpers/OFD/OFDApi';
import { FoodResult, FoodDetails } from '../ApiHelpers/CommonAPITypes';
import Toast from 'react-native-simple-toast';
import SwitchGroup from '../components/SwitchGroup';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useDebounceCallback } from '@react-hook/debounce';
import ActivityIndicator from '../components/ActivityIndicator';
import {
  FoodJournalStackParams,
  FoodJournalStackScreenNames,
} from '../Navigation/FoodJournalStack/Screens';
import { StackNavigationProp } from '@react-navigation/stack';

export default function Search({ navigation }: SearchProps) {
  const USDAapi = new USDAApiImpl();
  const OFDApi = new OFDApiImpl();

  const [searchText, updateSearchText] = useState('');
  const [results, updateResults] = useState<FoodResult[]>([]);
  const [page, updatePage] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [isFranceLocale, setIsFranceLocale] = useState(true);
  const [shouldUseOFD, setShouldUseOFD] = useState(true);
  const [isAtEndOfResults, setEnd] = useState(false);
  const foodList = useRef<FlatList<FoodResult>>();

  const scanBarcode = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status === 'granted') {
      navigation.navigate(FoodJournalStackScreenNames.BarCodeScanner);
    } else {
      Alert.prompt('You cannot search by barcode without camera access.');
    }
  };

  const handleSubmit = (): void => {
    try {
      foodList &&
        foodList.current &&
        foodList.current.scrollToOffset({ animated: false, offset: 0 });
      getResults(true);
    } catch (e) {
      showErrorToast();
    }
  };

  const getResults = async (isReset: boolean) => {
    try {
      setLoadingState(true);
      const pageToGet = isReset ? 0 : page + 1;
      const newResults = shouldUseOFD
        ? await OFDApi.search(searchText, isFranceLocale, pageToGet)
        : await USDAapi.search(searchText, pageToGet);
      updateResults(isReset ? [...newResults] : [...results, ...newResults]);
      updatePage(pageToGet);
      setEnd(newResults.length ? false : true);
      setLoadingState(false);
    } catch (e) {
      setLoadingState(false);
      showErrorToast();
    }
  };

  const showErrorToast = () =>
    Toast.showWithGravity(
      'There was a network error',
      Toast.LONG,
      Toast.CENTER
    );

  const showNotEnoughDetailsToast = () =>
    Toast.showWithGravity(
      "There isn't sufficient information for this food",
      Toast.SHORT,
      Toast.CENTER
    );

  const goToFoodDetails = async (api: string, id: string): Promise<void> => {
    try {
      let details: FoodDetails | undefined | null;
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
        navigation.navigate(FoodJournalStackScreenNames.Details, { details });
      } else {
        showNotEnoughDetailsToast();
      }
    } catch (e) {
      showErrorToast();
    }
  };

  const debouncedHandleSubmit = useCallback(
    useDebounceCallback(handleSubmit, 500),
    [searchText, shouldUseOFD, isFranceLocale]
  );

  useEffect(() => {
    if (searchText) {
      debouncedHandleSubmit();
    }
  }, [searchText, debouncedHandleSubmit, shouldUseOFD, isFranceLocale]);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.titleContainer}>
        <Text h2>Search for a food</Text>
        <Button
          type="solid"
          raised
          title="Scan barcode"
          onPress={scanBarcode}
        />
      </View>
      <SearchBar
        value={searchText}
        onChangeText={(text): void => updateSearchText(text)}
        containerStyle={{
          marginVertical: 10,
        }}
      />
      <SwitchGroup
        value={shouldUseOFD}
        onValueChange={setShouldUseOFD}
        switchText={shouldUseOFD ? 'Open Food Data' : 'USDA'}
        toolTipText={
          shouldUseOFD
            ? 'The Open Food Database is preferable for brand name foods.'
            : 'The USDA database is preferable for basic foods and ingredients.'
        }
        toolTipHeight={100}
        iconName="info"
      />
      <SwitchGroup
        value={!shouldUseOFD ? false : isFranceLocale}
        onValueChange={setIsFranceLocale}
        switchText={!shouldUseOFD ? 'USA' : isFranceLocale ? 'France' : 'USA'}
        toolTipText={
          'The Open Food Database can search for American or French brands.'
        }
        toolTipHeight={100}
        iconName="info"
      />
      <Divider />
      {loadingState && <ActivityIndicator size="large" />}
      {!loadingState && results ? (
        results.length ? (
          <FlatList
            ref={foodList as RefObject<FlatList>}
            data={results}
            keyExtractor={(item): string => item.id}
            renderItem={({ item }: { item: FoodResult }): JSX.Element => (
              <ListItem
                onPress={(): Promise<void> =>
                  goToFoodDetails(item.api, item.id)
                }
                title={item.description}
              />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => !isAtEndOfResults && getResults(false)}
          />
        ) : (
          <Text>No items found</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
  },
  switchGroupContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 2,
  },
  emptyContainer: {
    flex: 1,
  },
  icon: {
    marginHorizontal: 15,
  },
});

interface SearchProps {
  navigation: StackNavigationProp<
    FoodJournalStackParams,
    FoodJournalStackScreenNames.Search
  >;
}
