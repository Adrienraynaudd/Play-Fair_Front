import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NeoButton({ text, color, iconName, onPress }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.shadow} />

      <TouchableOpacity 
        onPress={onPress} 
        style={[styles.button, { backgroundColor: color }]}
      >
        <Text style={styles.text}>{text}</Text>
        <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={28} color={iconName === "add" ? "white" : "black"} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 130,
    height: 130,
    position: 'relative', 
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 15,
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    padding: 5,
    backgroundColor: 'transparent', 
  },
});