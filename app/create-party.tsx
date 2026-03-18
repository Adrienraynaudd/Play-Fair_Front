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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NeoButton from "../components/NeoButton";

export default function CreatePartyScreen() {
  const router = useRouter();

  const Rules = [
    { id: 1, color: "#FDE047" }, 
    { id: 2, color: "#F472B6" }, 
    { id: 3, color: "#A78BFA" }, 
  ];

  const [rules, setRules] = useState(Rules);

  const colorPalette = ["#FDE047", "#F472B6", "#A78BFA", "#6EE7B7"];

  const AddRule = () => {
    setRules((prevRules) => {
      const nextId =
        prevRules.length > 0 ? prevRules[prevRules.length - 1].id + 1 : 1;
      const nextColor = colorPalette[(nextId - 1) % colorPalette.length];

      return [...prevRules, { id: nextId, color: nextColor }];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- TITRE --- */}
        <View style={{ marginBottom: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "900" }}>
            Nouvelle Soirée
          </Text>
        </View>

        {/* --- INPUT TITRE PRINCIPAL --- */}
        <View style={styles.titleInputWrapper}>
          <View style={styles.shadow} />
          <TextInput
            style={styles.mainInput}
            placeholder="Nom de la soirée"
            placeholderTextColor="#000"
          />
        </View>

        {/* --- BOUTONS ACTIONS --- */}
        <View style={styles.actionsRow}>
          <ActionButton label="Ajouter" icon="add" onPress={AddRule} />
          <ActionButton label="Importer" icon="download-outline" />
          <ActionButton label="Exporter" icon="share-outline" />
        </View>

        {/* --- LISTE DES RÈGLES --- */}
        <View style={styles.rulesContainer}>
          {rules.map((rule) => (
            <RuleRow key={rule.id} color={rule.color} />
          ))}
        </View>

        {/* --- BOUTON VALIDER --- */}
        <View style={{ marginTop: 30, alignItems: "flex-end", width: "100%" }}>
          <NeoButton
            text="Valider"
            color="#FDE047"
            iconName="checkmark"
            height={60}
            width={150}
            orientation="row"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const handleCreateParty = async () => {
  try {
    const response = await api.post('/rooms', {
      name: "Nom saisi dans l'input",
      date: "2026-02-28",
      rules_group_id: "ID_DU_GROUPE_CHOISI"
    });

    if (response.status === 201) {
      alert(`Partie créée ! Code: ${response.data.room.roomCode}`);
      router.back();
    }
  } catch (error) {
    console.error("Erreur création:", error);
  }
};
interface ActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

const ActionButton = ({ label, icon, onPress }: ActionButtonProps) => (
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

const RuleRow = ({ color }: { color: string }) => (
  <View style={styles.ruleWrapper}>
    <View style={[styles.shadow, { backgroundColor: "black" }]} />
    <View style={[styles.ruleCard, { backgroundColor: color }]}>
      <View style={styles.inputsColumn}>
        <View style={styles.whiteInputContainer}>
          <TextInput
            placeholder="Nom règle"
            placeholderTextColor="#888"
            style={styles.minimalInput}
          />
        </View>
        <View style={[styles.whiteInputContainer, { marginTop: 8 }]}>
          <TextInput
            placeholder="Description"
            placeholderTextColor="#888"
            style={styles.minimalInput}
          />
        </View>
      </View>

      <View style={styles.pointsColumn}>
        <TouchableOpacity>
          <Ionicons name="caret-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>10</Text>
          <Text style={styles.ptsLabel}>pts</Text>
        </View>
        <TouchableOpacity>
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
    position: "absolute",
    top: 4,
    left: 4,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 15,
  },

  titleInputWrapper: { height: 80, width: "100%", marginBottom: 30 },
  mainInput: {
    flex: 1,
    backgroundColor: "#A78BFA",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "black",
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  smallBtnWrapper: { width: "31%", height: 60 },
  smallBtn: {
    flex: 1,
    backgroundColor: "#6EE7B7",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  smallBtnText: { fontSize: 11, fontWeight: "bold", marginRight: 4 },
  blackIconCircle: { backgroundColor: "black", borderRadius: 10, padding: 2 },

  rulesContainer: { width: "100%", gap: 20 },

  ruleWrapper: { height: 135, width: "100%" },

  ruleCard: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "black",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  inputsColumn: { flex: 2, marginRight: 10 },

  whiteInputContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 15,
    height: 40,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },

  minimalInput: {
    fontSize: 13,
    fontWeight: "600",
    height: "100%",
    textAlignVertical: "center",
    color: "black",
  },

  pointsColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreBox: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    minWidth: 40,
  },
  scoreText: { fontWeight: "900", fontSize: 16 },
  ptsLabel: { fontSize: 8, fontWeight: "bold" },
});
