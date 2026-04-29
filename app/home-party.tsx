import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { roomService } from "../services/rooms";

export default function HomePartyScreen() {
  const { id, name } = useLocalSearchParams();

  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const colorPalette = ["#A78BFA", "#FDE047", "#F472B6", "#6EE7B7"];
  var rules = [{nbPoints: 10, description: "Manger une part de pizza"}, {nbPoints: 20, description: "Boire un verre d'eau"}, {nbPoints: 30, description: "Faire une danse ridicule"}];

  const playerColorsRef = useRef<Record<string, string>>({});
const rulesColorsRef = React.useRef<string[]>([]);

  rules.forEach((rule) => {
    if (rulesColorsRef.current.length < rules.length) {
      const randomIndex = Math.floor(Math.random() * colorPalette.length);
      rulesColorsRef.current.push(colorPalette[randomIndex]);
    }
  });


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const data = await roomService.getRoomMembers(id as string);

        data.members.forEach((member: any) => {
          if (!playerColorsRef.current[member.username]) {
            const randomIndex = Math.floor(Math.random() * colorPalette.length);
            playerColorsRef.current[member.username] =
              colorPalette[randomIndex];
          }
        });

        const formattedPlayers = data.members.map((member: any) => ({
          id: member.id,
          name: member.username,
          score: 0,
          color: playerColorsRef.current[member.username],
        }));

        setPlayers(formattedPlayers);
      } catch (error) {
        console.error(error);
        Alert.alert(
          "Erreur",
          "Impossible de récupérer les joueurs de la soirée.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMembers();
    }
  }, [id]);

  const maxScore = Math.max(...players.map((player) => player.score), 1);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ marginBottom: 20, marginTop: 30, alignItems: "center" }}>
          <View style={styles.shadowTitle} />
          <Text style={styles.partyTitle}>{name || "Soirée"}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.bar} />
          <Text style={styles.sectionTitle}>Joueurs</Text>
          <View style={styles.bar} />
        </View>

        <View style={styles.playersGrid}>
          {players.length > 0 ? (
            players.map((player) => (
              <View key={player.id} style={styles.playerWrapper}>
                <View style={styles.playerCard}>
                  <Ionicons name="person" size={40} color="black" />
                  <Text style={styles.playerName} numberOfLines={1}>
                    {player.name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.playerShadow,
                    { backgroundColor: player.color },
                  ]}
                />
              </View>
            ))
          ) : (
            <Text style={{ fontStyle: "italic", color: "#888" }}>
              Aucun joueur dans cette soirée pour le moment.
            </Text>
          )}
        </View>

        <View style={[styles.sectionHeader, { marginTop: 40 }]}>
          <View style={styles.bar} />
          <Text style={styles.sectionTitle}>Score individuel</Text>
          <View style={styles.bar} />
        </View>

        <View style={styles.statsContainer}>
          {players.map((player) => {
            const barPercentage = Math.min(
              Math.max((player.score / maxScore) * 100, 0),
              100,
            );

            return (
              <View key={player.id} style={styles.statRow}>
                <Text style={styles.statName} numberOfLines={1}>
                  {player.name}
                </Text>
                <View style={styles.statBarTrack}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${barPercentage}%`,
                        backgroundColor: player.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{player.score}</Text>
              </View>
            );
          })}
          
{/*--- Régles ---*/}
        <View
          style={{
            marginBottom: 20,
            marginTop: 40,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            position: "relative",
            alignContent: "center",
          }}
        >
          <View style={styles.bar} />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Règles
          </Text>
          <View style={styles.bar} />
        </View>

        <View style={styles.rulesContainer}>
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleWrapper}>
              <View style={styles.ruleCard}>
                <Text style={styles.ruleDescription}>{rule.description}</Text>
                <Text style={styles.rulePoints}>{rule.nbPoints} pts</Text>
              </View>
              <View
                style={[
                  styles.ruleBackground,
                  { backgroundColor: rulesColorsRef.current[index] },
                ]}
              />
            </View>
          ))}
        </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 50 },
  shadowTitle: {
    position: "absolute",
    top: 4,
    left: 4,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 15,
  },
  partyTitle: {
    fontSize: 24,
    fontWeight: "900",
    backgroundColor: "#F472B6",
    padding: 20,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
    width: "100%",
    textAlign: "center",
  },
  sectionHeader: {
    marginBottom: 20,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  bar: {
    flex: 1,
    height: 5,
    backgroundColor: "black",
    borderRadius: 15,
    marginHorizontal: 8,
  },
  playersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  playerWrapper: {
    position: "relative",
    width: "30%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playerCard: {
    position: "relative",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 2,
    zIndex: 1,
    width: "100%",
    height: "100%",
    padding: 5,
  },
  playerName: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  playerShadow: {
    position: "absolute",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
    width: "100%",
    height: "100%",
    top: 0,
    left: 8,
  },
  statsContainer: {
    marginTop: 8,
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statName: {
    width: 70,
    fontSize: 12,
    fontWeight: "700",
  },
  statBarTrack: {
    flex: 1,
    height: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    maxWidth: "100%",
  },
  statValue: {
    width: 40,
    textAlign: "right",
    fontWeight: "900",
  },
  rulesContainer: {
    marginTop: 8,
    gap: 12,
  },
  ruleWrapper: {
    position: "relative",
    width: "100%",
    minHeight: 90,
    marginBottom: 12,
  },
  ruleCard: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    padding: 14,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ruleBackground: {
    position: "absolute",
    top: 8,
    left: 8,
    width: "100%",
    height: "65%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  rulePoints: {
    width: 50,
    fontSize: 12,
    fontWeight: "700",
  },
  ruleDescription: {
    flex: 1,
    fontSize: 12,
    lineHeight: 20,
  },
});
