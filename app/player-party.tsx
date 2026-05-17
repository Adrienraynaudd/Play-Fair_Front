import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { challengeService, resolveScoreValue } from "../services/challenges";
import { normalizeRules, type RuleItem, rulesService } from "../services/rules";

type PlayerPartyParams = {
  roomId?: string;
  roomName?: string;
  playerId?: string;
  playerName?: string;
  playerColor?: string;
  playerScore?: string;
  rulesGroupId?: string;
  rulesPayload?: string;
};

const accentColors = ["#F472B6", "#6EE7B7", "#A78BFA", "#FDE047"];

const parseRulesPayload = (rawPayload?: string) => {
  if (!rawPayload) {
    return [];
  }

  try {
    const parsedPayload = JSON.parse(rawPayload);
    return Array.isArray(parsedPayload) ? normalizeRules(parsedPayload) : [];
  } catch {
    return [];
  }
};

export default function PlayerPartyScreen() {
  const router = useRouter();
  const {
    roomId,
    roomName,
    playerId,
    playerName,
    playerColor,
    playerScore,
    rulesGroupId,
    rulesPayload,
  } = useLocalSearchParams<PlayerPartyParams>();

  const resolvedRoomId = typeof roomId === "string" ? roomId : "";
  const resolvedRoomName = typeof roomName === "string" ? roomName : "Soirée";
  const resolvedPlayerId = typeof playerId === "string" ? playerId : "";
  const resolvedPlayerName =
    typeof playerName === "string" ? playerName : "Nom du joueur";
  const resolvedPlayerColor =
    typeof playerColor === "string" ? playerColor : "#F472B6";
  const resolvedRulesGroupId =
    typeof rulesGroupId === "string" ? rulesGroupId : "";
  const serializedRulesPayload =
    typeof rulesPayload === "string" ? rulesPayload : "";
  const initialRules = parseRulesPayload(serializedRulesPayload || undefined);
  const initialScore = resolveScoreValue(
    { score: typeof playerScore === "string" ? playerScore : 0 },
    0,
  );

  const [rules, setRules] = useState<RuleItem[]>(initialRules);
  const [score, setScore] = useState(initialScore);
  const [ruleCounts, setRuleCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submittingRuleId, setSubmittingRuleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerPartyData = async () => {
      try {
        setIsLoading(true);

        let availableRules = initialRules;

        if (!availableRules.length && resolvedRulesGroupId) {
          availableRules = await rulesService
            .getRulesByGroup(resolvedRulesGroupId)
            .catch(() => []);
        }

        setRules(availableRules);

        if (resolvedRoomId && resolvedPlayerId) {
          const summary = await challengeService
            .getPlayerChallengeSummary(resolvedRoomId, resolvedPlayerId)
            .catch((error) => {
              console.error("Error fetching player challenge summary", error);
              return null;
            });

          if (summary) {
            setScore(summary.score);
            setRuleCounts(summary.ruleCounts);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerPartyData();
  }, [
    resolvedPlayerId,
    resolvedRoomId,
    resolvedRulesGroupId,
    serializedRulesPayload,
  ]);

  const handleValidateRule = (rule: RuleItem) => {
    Alert.alert(
      "Valider un défi",
      `Attribuer ${rule.points} points à ${resolvedPlayerName} pour \"${rule.name}\" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Valider",
          onPress: () => submitRuleValidation(rule),
        },
      ],
    );
  };

  const submitRuleValidation = async (rule: RuleItem) => {
    if (!resolvedRoomId || !resolvedPlayerId) {
      Alert.alert(
        "Données manquantes",
        "Impossible de retrouver ce joueur ou cette soirée.",
      );
      return;
    }

    setSubmittingRuleId(rule.id);

    try {
      const result = await challengeService.validateRuleForPlayer(
        resolvedRoomId,
        resolvedPlayerId,
        rule.id,
      );

      setScore(result.score);
      setRuleCounts((previousCounts) => ({
        ...previousCounts,
        [rule.id]: result.ruleCount || (previousCounts[rule.id] ?? 0) + 1,
      }));
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error?.response?.data?.message ||
          "Impossible de valider ce défi pour le moment.",
      );
    } finally {
      setSubmittingRuleId(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="black" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <Text style={styles.playerTitle}>{resolvedPlayerName}</Text>
        <Text style={styles.roomLabel}>{resolvedRoomName}</Text>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={[styles.scoreValue, { color: resolvedPlayerColor }]}>
          {score}
        </Text>
        <Text style={styles.helperText}>
          Touchez une règle pour valider le défi et attribuer les points au
          joueur.
        </Text>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={resolvedPlayerColor}
            style={styles.loadingIndicator}
          />
        ) : rules.length > 0 ? (
          <View style={styles.rulesGrid}>
            {rules.map((rule, index) => {
              const accentColor = accentColors[index % accentColors.length];
              const validationCount = ruleCounts[rule.id] ?? 0;
              const isSubmitting = submittingRuleId === rule.id;

              return (
                <TouchableOpacity
                  key={rule.id}
                  activeOpacity={0.9}
                  onPress={() => handleValidateRule(rule)}
                  disabled={submittingRuleId !== null}
                  style={styles.ruleTouchTarget}
                >
                  <View
                    style={[
                      styles.ruleShadow,
                      { backgroundColor: accentColor },
                    ]}
                  />
                  <View style={styles.ruleCard}>
                    <Text style={styles.ruleName} numberOfLines={2}>
                      {rule.name}
                    </Text>
                    <Text style={styles.ruleDescription} numberOfLines={4}>
                      {rule.description}
                    </Text>
                    <View style={styles.separator} />
                    <Text style={styles.rulePoints}>
                      Nombres de points : {rule.points}
                    </Text>
                    <View style={styles.validationFooter}>
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="black" />
                      ) : (
                        <Text style={styles.validationCount}>
                          {validationCount}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Les règles de cette soirée sont indisponibles pour le moment.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "black",
  },
  playerTitle: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    color: "#222",
  },
  roomLabel: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    color: "#666",
    marginTop: 6,
  },
  scoreLabel: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
  },
  scoreValue: {
    marginTop: 6,
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
  },
  helperText: {
    marginTop: 12,
    marginBottom: 24,
    textAlign: "center",
    color: "#555",
    lineHeight: 20,
  },
  loadingIndicator: {
    marginTop: 40,
  },
  rulesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },
  ruleTouchTarget: {
    width: "48%",
    minHeight: 190,
    position: "relative",
  },
  ruleShadow: {
    position: "absolute",
    top: 4,
    left: 4,
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
  },
  ruleCard: {
    minHeight: 190,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: "space-between",
    alignItems: "center",
  },
  ruleName: {
    width: "100%",
    fontSize: 20,
    fontWeight: "900",
    color: "#222",
    marginBottom: 10,
    textAlign: "center",
  },
  ruleDescription: {
    width: "100%",
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    lineHeight: 19,
    minHeight: 54,
    textAlign: "center",
  },
  separator: {
    height: 2,
    width: 80,
    backgroundColor: "#222",
    alignSelf: "center",
    marginVertical: 10,
  },
  rulePoints: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  validationFooter: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 28,
  },
  validationCount: {
    fontSize: 18,
    color: "#222",
    fontWeight: "900",
  },
  emptyCard: {
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "#FFF8DB",
    padding: 18,
  },
  emptyText: {
    textAlign: "center",
    color: "#444",
    lineHeight: 21,
  },
});
