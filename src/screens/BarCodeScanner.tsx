import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-simple-toast';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import OFDApiImpl from '../ApiHelpers/OFD/OFDApi';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FoodJournalStackParams } from '../Navigation/FoodJournalStack/Screens';

export default function BarCodeScannerScreen({
  navigation,
}: BarCodeScannerScreenProps) {
  const [isFocused, toggleIsFocused] = useState(false);

  const handleBarCodeScanned = async ({ data }: BarCodeEvent) => {
    try {
      const OFDApi = new OFDApiImpl();
      const details = await OFDApi.barcodeSearch(data);
      if (details) {
        navigation.navigate('Details', { details });
      } else {
        Toast.showWithGravity(
          'This food does not have enough information',
          Toast.SHORT,
          Toast.CENTER
        );
        navigation.navigate('Search');
      }
    } catch (e) {
      Toast.showWithGravity(
        'There was an error getting your food data',
        Toast.SHORT,
        Toast.CENTER
      );
      navigation.navigate('Search');
    }
  };

  useFocusEffect(() => {
    toggleIsFocused(true);
    return () => toggleIsFocused(false);
  });

  return isFocused ? (
    <BarCodeScanner
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.interleaved2of5]}
      onBarCodeScanned={handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  ) : null;
}

interface BarCodeScannerScreenProps {
  navigation: StackNavigationProp<FoodJournalStackParams, 'BarCodeScanner'>;
}
