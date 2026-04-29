import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HistoryItemProps {
  name: string;
  date: string;
  score: string;
  color: string;
  onPress?: () => void;
}

export default function HistoryItem({
  name,
  date,
  score,
  color,
  onPress,
}: HistoryItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, { backgroundColor: color }]}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{score}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "black",
    marginBottom: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "900",
    color: "black",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  scoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    fontSize: 18,
    fontWeight: "900",
    color: "black",
  },
});