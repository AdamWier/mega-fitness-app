import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import globalStyle from './StyleSheet';

export default function PrimaryButton({text, onPress}) {
  return (
    <TouchableOpacity style={styles.buttonPrimary} onPress={onPress}>
        <Text style={[globalStyle.text, styles.text]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    textAlign: 'center',
  },
  buttonPrimary: {
    margin:10,
    paddingVertical: 5,
    paddingHorizontal: 30,
    backgroundColor:'#375a7f',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#375a7f',
  }
});
