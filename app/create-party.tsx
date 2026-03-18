import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NeoButton from "../components/NeoButton";
import { roomService } from "../services/rooms";
import { rulesService } from "../services/rules";

// Définition de l'interface pour une règle
interface Rule {
  id: number;
  color: string;
  name: string;
  description: string;
  points: number;
}

export default function CreatePartyScreen() {
  const router = useRouter();
  const [partyName, setPartyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Utilisation de l'interface Rule pour le state
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, color: "#FDE047", name: "", description: "", points: 10 },
    { id: 2, color: "#F472B6", name: "", description: "", points: 20 },
    { id: 3, color: "#A78BFA", name: "", description: "", points: 30 },
  ]);

  const colorPalette = ["#FDE047", "#F472B6", "#A78BFA", "#6EE7B7"];

  const AddRule = () => {
    setRules((prev) => {
      const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1;
      const nextColor = colorPalette[(nextId - 1) % colorPalette.length];
      return [...prev, { id: nextId, color: nextColor, name: "", description: "", points: 10 }];
    });
  };

  const updateRule = (id: number, field: keyof Rule, value: string | number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleCreateParty = async () => {
    if (!partyName) {
      Alert.alert("Erreur", "Donnez un nom à votre soirée !");
      return;
    }

    setIsLoading(true);
    try {
      const newGroupId = await rulesService.createRulesGroup(partyName, rules);
      const data = await roomService.createRoom(
        partyName,
        new Date().toISOString().split('T')[0],
        newGroupId
      );

      setIsLoading(false);
      Alert.alert("Succès ! 🎉", `Code de la soirée : ${data.room.roomCode}`);
      router.back();
    } catch (error: any) {
      setIsLoading(false);
      console.error(error);
      Alert.alert("Erreur", "Impossible de créer la soirée. Vérifiez votre connexion.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ marginBottom: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "900" }}>Nouvelle Soirée</Text>
        </View>

        <View style={styles.titleInputWrapper}>
          <View style={styles.shadow} />
          <TextInput
            style={styles.mainInput}
            placeholder="Nom de la soirée"
            placeholderTextColor="#555"
            value={partyName}
            onChangeText={setPartyName}
          />
        </View>

        <View style={styles.actionsRow}>
          <ActionButton label="Ajouter" icon="add" onPress={AddRule} />
          <ActionButton label="Importer" icon="download-outline" />
          <ActionButton label="Exporter" icon="share-outline" />
        </View>

        <View style={styles.rulesContainer}>
          {rules.map((rule) => (
            <RuleRow 
              key={rule.id} 
              rule={rule} 
              // Correction des types ici : field est une clé de Rule, val est string ou number
              onUpdate={(field: keyof Rule, val: string | number) => updateRule(rule.id, field, val)} 
            />
          ))}
        </View>

        <View style={{ marginTop: 30, alignItems: "flex-end", width: "100%" }}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FDE047" />
          ) : (
            <NeoButton
              text="Valider"
              color="#6EE7B7"
              iconName="checkmark"
              height={60}
              width={150}
              orientation="row"
              onPress={handleCreateParty}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- SOUS-COMPOSANTS ---

const ActionButton = ({ label, icon, onPress }: { label: string, icon: any, onPress?: () => void }) => (
  <View style={styles.smallBtnWrapper}>
    <View style={[styles.shadow, { backgroundColor: "black" }]} />
    <TouchableOpacity style={styles.smallBtn} onPress={onPress}>
      <Text style={styles.smallBtnText}>{label}</Text>
      <View style={styles.blackIconCircle}>
        <Ionicons name={icon} size={16} color="white" />
      </View>
    </TouchableOpacity>
  </View>
);

const RuleRow = ({ rule, onUpdate }: { rule: Rule, onUpdate: (field: keyof Rule, val: string | number) => void }) => (
  <View style={styles.ruleWrapper}>
    <View style={[styles.shadow, { backgroundColor: "black" }]} />
    <View style={[styles.ruleCard, { backgroundColor: rule.color }]}>
      <View style={styles.inputsColumn}>
        <View style={styles.whiteInputContainer}>
          <TextInput
            placeholder="Nom règle"
            style={styles.minimalInput}
            value={rule.name}
            onChangeText={(t) => onUpdate("name", t)}
          />
        </View>
        <View style={[styles.whiteInputContainer, { marginTop: 8 }]}>
          <TextInput
            placeholder="Description"
            style={styles.minimalInput}
            value={rule.description}
            onChangeText={(t) => onUpdate("description", t)}
          />
        </View>
      </View>

      <View style={styles.pointsColumn}>
        <TouchableOpacity onPress={() => onUpdate("points", Math.max(0, rule.points - 5))}>
          <Ionicons name="caret-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{rule.points}</Text>
          <Text style={styles.ptsLabel}>pts</Text>
        </View>
        <TouchableOpacity onPress={() => onUpdate("points", rule.points + 5)}>
          <Ionicons name="caret-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 50 },
  shadow: {
    position: "absolute", top: 4, left: 4, width: "100%", height: "100%",
    backgroundColor: "black", borderRadius: 15,
  },
  titleInputWrapper: { height: 80, width: "100%", marginBottom: 30 },
  mainInput: {
    flex: 1, backgroundColor: "#A78BFA", borderRadius: 15, borderWidth: 3,
    borderColor: "black", paddingHorizontal: 20, fontSize: 20, fontWeight: "bold", textAlign: "center",
  },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  smallBtnWrapper: { width: "31%", height: 60 },
  smallBtn: {
    flex: 1, backgroundColor: "#6EE7B7", borderRadius: 12, borderWidth: 3,
    borderColor: "black", flexDirection: "row", alignItems: "center", justifyContent: "center",
  },
  smallBtnText: { fontSize: 11, fontWeight: "bold", marginRight: 4 },
  blackIconCircle: { backgroundColor: "black", borderRadius: 10, padding: 2 },
  rulesContainer: { width: "100%", gap: 20 },
  ruleWrapper: { height: 135, width: "100%" },
  ruleCard: {
    flex: 1, borderRadius: 15, borderWidth: 3, borderColor: "black",
    flexDirection: "row", padding: 10, alignItems: "center",
  },
  inputsColumn: { flex: 2, marginRight: 10 },
  whiteInputContainer: {
    backgroundColor: "white", borderRadius: 20, borderWidth: 2, borderColor: "black",
    paddingHorizontal: 15, height: 40, justifyContent: "center",
  },
  minimalInput: { fontSize: 13, fontWeight: "600", color: "black" },
  pointsColumn: { flex: 1.2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scoreBox: {
    backgroundColor: "white", borderWidth: 2, borderColor: "black",
    borderRadius: 10, padding: 5, alignItems: "center", minWidth: 45,
  },
  scoreText: { fontWeight: "900", fontSize: 16 },
  ptsLabel: { fontSize: 8, fontWeight: "bold" },
});