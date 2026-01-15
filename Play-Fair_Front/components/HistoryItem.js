import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HistoryItem({ name, date, score, color }) {
  return (
    <View style={styles.wrapper}>
      {/* Ombre */}
      <View style={styles.shadow} />
      
      {/* Carte */}
      <View style={[styles.content, { backgroundColor: color }]}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.date}>Date: {date}</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 80,
    marginBottom: 20,
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 15,
  },
  content: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '35%',
  },
  date: {
    fontWeight: '600',
    fontSize: 14,
  },
  score: {
    fontWeight: '900',
    fontSize: 16,
  },
});