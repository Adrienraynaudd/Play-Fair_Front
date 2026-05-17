import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { resolveScoreValue } from "../services/challenges";
import { buildRoomJoinPayload } from "../services/room-share";
import { type RoomDetails, roomService } from "../services/rooms";
import { normalizeRules, type RuleItem, rulesService } from "../services/rules";

interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

const colorPalette = ["#A78BFA", "#FDE047", "#F472B6", "#6EE7B7"];
const creatorRoles = new Set(["creator", "owner", "host", "admin"]);

const isCurrentUserActor = (actor: RoomDetails["owner"]) =>
  typeof actor === "object" && actor !== null && actor.isCurrentUser === true;

const resolveRulesGroupId = (room: RoomDetails | null) =>
  room?.rulesGroupId ?? room?.rules_group_id ?? room?.rulesGroup?.id ?? null;

const resolveCreatorAccess = (room: RoomDetails | null) => {
  if (!room) {
    return false;
  }

  if (room.isCreator || room.canManageRules || room.isHost) {
    return true;
  }

  const role = room.role?.toLowerCase();

  if (role && creatorRoles.has(role)) {
    return true;
  }

  return (
    isCurrentUserActor(room.owner) ||
    isCurrentUserActor(room.createdBy) ||
    isCurrentUserActor(room.host)
  );
};

const resolveRoomRules = async (room: RoomDetails) => {
  if (room.rules?.length) {
    return normalizeRules(room.rules);
  }

  if (room.rulesGroup?.rules?.length) {
    return normalizeRules(room.rulesGroup.rules);
  }

  const rulesGroupId = resolveRulesGroupId(room);

  if (!rulesGroupId) {
    return [];
  }

  return rulesService.getRulesByGroup(rulesGroupId);
};

export default function HomePartyScreen() {
  const router = useRouter();
  const {
    id,
    name,
    roomCode: roomCodeParam,
    rulesGroupId: rulesGroupIdParam,
  } = useLocalSearchParams<{
    id?: string;
    name?: string;
    roomCode?: string;
    rulesGroupId?: string;
  }>();

  const resolvedId = typeof id === "string" ? id : "";
  const resolvedName = typeof name === "string" ? name : "Soirée";
  const initialRoomCode =
    typeof roomCodeParam === "string" ? roomCodeParam : "";
  const initialRulesGroupId =
    typeof rulesGroupIdParam === "string" ? rulesGroupIdParam : "";

  const [players, setPlayers] = useState<Player[]>([]);
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [partyName, setPartyName] = useState(resolvedName);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showRuleComposer, setShowRuleComposer] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDescription, setNewRuleDescription] = useState("");
  const [newRulePoints, setNewRulePoints] = useState(10);
  const [isSavingRule, setIsSavingRule] = useState(false);

  const playerColorsRef = useRef<Record<string, string>>({});
  const ruleColorsRef = useRef<Record<string, string>>({});

  const getRuleColor = (ruleKey: string, index: number) => {
    if (!ruleColorsRef.current[ruleKey]) {
      ruleColorsRef.current[ruleKey] =
        colorPalette[index % colorPalette.length];
    }

    return ruleColorsRef.current[ruleKey];
  };

  const resetRuleComposer = () => {
    setNewRuleName("");
    setNewRuleDescription("");
    setNewRulePoints(10);
  };

  const fetchPartyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [membersData, roomData] = await Promise.all([
        roomService.getRoomMembers(resolvedId),
        roomService.getRoom(resolvedId).catch((error) => {
          console.error("Error fetching room details", error);
          return null;
        }),
      ]);

      membersData.members.forEach((member) => {
        if (!playerColorsRef.current[member.username]) {
          const randomIndex = Math.floor(Math.random() * colorPalette.length);
          playerColorsRef.current[member.username] = colorPalette[randomIndex];
        }
      });

      const formattedPlayers = membersData.members.map((member) => ({
        id: member.id,
        name: member.username,
        score: resolveScoreValue(member, 0),
        color: playerColorsRef.current[member.username],
      }));

      setPlayers(formattedPlayers);
      setRoomDetails(roomData);
      setIsCreator(resolveCreatorAccess(roomData));

      if (roomData?.name) {
        setPartyName(roomData.name);
      }

      if (roomData?.roomCode) {
        setRoomCode(roomData.roomCode);
      }

      const fallbackRulesGroupId =
        initialRulesGroupId || resolveRulesGroupId(roomData);
      let fetchedRules: RuleItem[] = [];

      if (roomData) {
        fetchedRules = await resolveRoomRules(roomData).catch(() => []);
      }

      if (!fetchedRules.length && fallbackRulesGroupId) {
        fetchedRules = await rulesService
          .getRulesByGroup(fallbackRulesGroupId)
          .catch(() => []);
      }

      setRules(fetchedRules);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Impossible de récupérer les joueurs de la soirée.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [initialRulesGroupId, resolvedId]);

  useFocusEffect(
    useCallback(() => {
      if (resolvedId) {
        fetchPartyData();
      }
    }, [fetchPartyData, resolvedId]),
  );

  const handleAddRule = async () => {
    const trimmedName = newRuleName.trim();
    const trimmedDescription = newRuleDescription.trim();
    const rulesGroupId = resolveRulesGroupId(roomDetails);

    if (!trimmedDescription) {
      Alert.alert(
        "Description requise",
        "Ajoutez au moins une description pour la règle.",
      );
      return;
    }

    if (!rulesGroupId) {
      Alert.alert(
        "Back requis",
        "Le back doit renvoyer `rules_group_id` ou `rulesGroupId` dans le détail de la soirée pour permettre l'ajout de règles.",
      );
      return;
    }

    setIsSavingRule(true);

    try {
      const createdRule = await rulesService.createRule({
        name: trimmedName || "Règle sans nom",
        description: trimmedDescription,
        points: newRulePoints,
        rulesGroupId,
      });
      const refreshedRules = await rulesService
        .getRulesByGroup(rulesGroupId)
        .catch(() => [...rules, createdRule]);

      setRules(refreshedRules);
      setShowRuleComposer(false);
      resetRuleComposer();
      Alert.alert("Succès", "La règle a bien été ajoutée.");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error?.response?.data?.message ||
          "Impossible d'ajouter cette règle pour le moment.",
      );
    } finally {
      setIsSavingRule(false);
    }
  };

  const maxScore = Math.max(...players.map((player) => player.score), 1);
  const sharePayload = roomCode ? buildRoomJoinPayload(roomCode) : "";

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
        <View style={styles.partyHeader}>
          <View style={styles.shadowTitle} />
          <Text style={styles.partyTitle}>{partyName}</Text>
        </View>

        <View style={styles.shareCard}>
          <Text style={styles.shareTitle}>QR code pour rejoindre</Text>

          {roomCode ? (
            <>
              <View style={styles.qrFrame}>
                <QRCode
                  value={sharePayload}
                  size={170}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              <Text style={styles.codeLabel}>Code: {roomCode}</Text>
            </>
          ) : (
            <Text style={styles.shareHint}>
              Le code de partage de la soirée n&apos;est pas disponible pour le
              moment.
            </Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.bar} />
          <Text style={styles.sectionTitle}>Joueurs</Text>
          <View style={styles.bar} />
        </View>

        <View style={styles.playersGrid}>
          {players.length > 0 ? (
            players.map((player) => (
              <TouchableOpacity
                key={player.id}
                activeOpacity={0.9}
                style={styles.playerWrapper}
                onPress={() => {
                  router.push({
                    pathname: "/player-party",
                    params: {
                      roomId: resolvedId,
                      roomName: partyName,
                      playerId: player.id,
                      playerName: player.name,
                      playerColor: player.color,
                      playerScore: String(player.score),
                      rulesGroupId:
                        resolveRulesGroupId(roomDetails) || initialRulesGroupId,
                      rulesPayload: JSON.stringify(rules),
                    },
                  });
                }}
              >
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
              </TouchableOpacity>
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
        </View>

        <View style={styles.rulesHeader}>
          <View style={styles.bar} />
          <Text style={styles.sectionTitle}>Règles</Text>
          <View style={styles.bar} />
        </View>

        {isCreator ? (
          <View style={styles.creatorControls}>
            <View style={styles.actionButtonWrapper}>
              <View style={styles.actionButtonShadow} />
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  if (showRuleComposer) {
                    resetRuleComposer();
                  }

                  setShowRuleComposer(!showRuleComposer);
                }}
              >
                <Text style={styles.actionButtonText}>
                  {showRuleComposer ? "Fermer l'éditeur" : "Ajouter une règle"}
                </Text>
                <Ionicons
                  name={showRuleComposer ? "close" : "add"}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {showRuleComposer ? (
          <View style={styles.composerWrapper}>
            <View style={styles.composerShadow} />
            <View style={styles.composerCard}>
              <Text style={styles.composerTitle}>Nouvelle règle</Text>
              <TextInput
                style={styles.composerInput}
                placeholder="Nom de la règle"
                placeholderTextColor="#666"
                value={newRuleName}
                onChangeText={setNewRuleName}
              />
              <TextInput
                style={[styles.composerInput, styles.composerDescriptionInput]}
                placeholder="Description de la règle"
                placeholderTextColor="#666"
                multiline
                textAlignVertical="top"
                value={newRuleDescription}
                onChangeText={setNewRuleDescription}
              />

              <View style={styles.pointsEditorRow}>
                <TouchableOpacity
                  style={styles.pointsArrow}
                  onPress={() =>
                    setNewRulePoints((prev) => Math.max(5, prev - 5))
                  }
                >
                  <Ionicons name="caret-back" size={22} color="black" />
                </TouchableOpacity>

                <View style={styles.pointsPill}>
                  <Text style={styles.pointsPillValue}>
                    {newRulePoints} pts
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.pointsArrow}
                  onPress={() => setNewRulePoints((prev) => prev + 5)}
                >
                  <Ionicons name="caret-forward" size={22} color="black" />
                </TouchableOpacity>
              </View>

              {isSavingRule ? (
                <ActivityIndicator size="small" color="#F472B6" />
              ) : (
                <TouchableOpacity
                  style={styles.saveRuleButton}
                  onPress={handleAddRule}
                >
                  <Text style={styles.saveRuleButtonText}>
                    Enregistrer la règle
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.rulesContainer}>
          {rules.length > 0 ? (
            rules.map((rule, index) => {
              const ruleKey = rule.id || `${rule.name}-${index}`;

              return (
                <View key={ruleKey} style={styles.ruleWrapper}>
                  <View style={styles.ruleCard}>
                    <View style={styles.ruleTextContent}>
                      <Text style={styles.ruleName}>{rule.name}</Text>
                      <Text style={styles.ruleDescription}>
                        {rule.description}
                      </Text>
                    </View>
                    <Text style={styles.rulePoints}>{rule.points} pts</Text>
                  </View>
                  <View
                    style={[
                      styles.ruleBackground,
                      { backgroundColor: getRuleColor(ruleKey, index) },
                    ]}
                  />
                </View>
              );
            })
          ) : (
            <View style={styles.emptyRulesCard}>
              <Text style={styles.emptyRulesText}>
                Aucune règle n&apos;est disponible pour cette soirée pour le
                moment.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 50 },
  partyHeader: { marginBottom: 20, marginTop: 30, alignItems: "center" },
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
  shareCard: {
    alignItems: "center",
    backgroundColor: "#FFF8DB",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
    textAlign: "center",
  },
  qrFrame: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000",
  },
  codeLabel: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "900",
  },
  shareHint: {
    marginTop: 10,
    color: "#444",
    textAlign: "center",
    lineHeight: 21,
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
    marginBottom: 12,
  },
  rulesHeader: {
    marginBottom: 20,
    marginTop: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
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
  creatorControls: {
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonWrapper: {
    width: "100%",
    height: 58,
    position: "relative",
    marginBottom: 16,
  },
  actionButtonShadow: {
    position: "absolute",
    top: 4,
    left: 4,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 15,
  },
  actionButton: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "#6EE7B7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "900",
  },
  composerWrapper: {
    position: "relative",
    width: "100%",
    minHeight: 250,
    marginBottom: 20,
  },
  composerShadow: {
    position: "absolute",
    top: 6,
    left: 6,
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "black",
  },
  composerCard: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "#FDE047",
    padding: 16,
    gap: 12,
  },
  composerTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  composerInput: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "black",
  },
  composerDescriptionInput: {
    minHeight: 92,
  },
  pointsEditorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  pointsArrow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  pointsPill: {
    minWidth: 100,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    alignItems: "center",
  },
  pointsPillValue: {
    fontWeight: "900",
    fontSize: 15,
  },
  saveRuleButton: {
    marginTop: 4,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "#F472B6",
    paddingVertical: 14,
    alignItems: "center",
  },
  saveRuleButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "black",
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
    alignItems: "flex-start",
    gap: 10,
  },
  ruleTextContent: {
    flex: 1,
    gap: 6,
  },
  ruleName: {
    fontSize: 15,
    fontWeight: "900",
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
    textAlign: "right",
  },
  ruleDescription: {
    fontSize: 12,
    lineHeight: 20,
  },
  emptyRulesCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#FFF8DB",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  emptyRulesText: {
    textAlign: "center",
    color: "#444",
    lineHeight: 21,
  },
});
