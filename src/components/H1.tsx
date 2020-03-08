import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function H1({text}) {
  return (
    <Text style={styles.text}>{text}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 45,
    textAlign: 'center',
  },
});
