import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomePartyScreen() {
  const color1 = "#A78BFA";
  const color2 = "#FDE047";
  const color3 = "#F472B6";
  const color4 = "#6EE7B7";
  const colorPalette = [color1, color2, color3, color4];
  var partyName = "Soirée Pizza";
  var players = [
    "jean1",
    "jean2",
    "jean4",
    "jean5",
    "jean6",
    "jean7",
    "jean8",
    "jean9",
    "jean10",
  ];
  var scores = [100, 18, 11, 12, 13, 14, 15, 16, 17];

  const playerColorsRef = React.useRef<Record<string, string>>({});

  players.forEach((player) => {
    if (!playerColorsRef.current[player]) {
      const randomIndex = Math.floor(Math.random() * colorPalette.length);
      playerColorsRef.current[player] = colorPalette[randomIndex];
    }
  });

  const playerStats = players.map((name, index) => ({
    name,
    score: scores[index] ?? 0,
    color: playerColorsRef.current[name],
  }));
  const maxScore = Math.max(...playerStats.map((player) => player.score), 1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- TITRE --- */}
        <View style={{ marginBottom: 20, marginTop: 30, alignItems: "center" }}>
          <View
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              borderRadius: 15,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "900",
              backgroundColor: color3,
              padding: 20,
              borderRadius: 10,
              borderColor: "black",
              borderWidth: 2,
              width: "100%",
              textAlign: "center",
            }}
          >
            {partyName}
          </Text>
        </View>

        {/*--- Joueurs ---*/}
        <View
          style={{
            marginBottom: 20,
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            position: "relative",
            alignContent: "center",
          }}
        >
          <View style={styles.bar} />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Joueurs
          </Text>
          <View style={styles.bar} />
        </View>

        {/*--- LISTE DES JOUEURS ---*/}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            rowGap: 20,
          }}
        >
          {players.map((player) => (
            <View
              key={player}
              style={{
                position: "relative",
                width: "30%",
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
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
                }}
              >
                <Ionicons name="person" size={40} color="black" />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {player}
                </Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  borderRadius: 10,
                  borderColor: "black",
                  backgroundColor: playerColorsRef.current[player],
                  borderWidth: 2,
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 8,
                }}
              />
            </View>
          ))}
        </View>

        {/*--- Score individuel ---*/}
        <View
          style={{
            marginBottom: 20,
            marginTop: 40,
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            position: "relative",
            alignContent: "center",
          }}
        >
          <View style={styles.bar} />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Score individuel
          </Text>
          <View style={styles.bar} />
        </View>

        <View style={styles.statsContainer}>
          {playerStats.map((player) => {
            const barPercentage = Math.min(
              Math.max((player.score / maxScore) * 100, 0),
              100
            );

            return (
              <View key={player.name} style={styles.statRow}>
                <Text style={styles.statName}>{player.name}</Text>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 50 },
  bar: {
    flex: 1,
    height: 5,
    backgroundColor: "black",
    borderRadius: 15,
    marginHorizontal: 8,
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
});
