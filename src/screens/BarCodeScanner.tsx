import React from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-simple-toast';
import { BarCodeScanner } from 'expo-barcode-scanner';
import OFDApiImpl from '../ApiHelpers/OFD/OFDApiImpl';
import PropTypes from 'prop-types';

export default function BarCodeScannerScreen({ navigation }) {
  const handleBarCodeScanned = async ({ data }) => {
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

  return (
    <BarCodeScanner
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.interleaved2of5]}
      onBarCodeScanned={handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  );
}

BarCodeScannerScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
