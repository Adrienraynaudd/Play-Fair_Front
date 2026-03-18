import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryItem from "../../components/HistoryItem";
import NeoButton from "../../components/NeoButton";

export default function HomeScreen() {
  const router = useRouter();

  const testConnection = async () => {
    console.log("\n=== DÉBUT DU TEST DE CONNEXION ===");

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      console.log("ÉTAPE 1 : URL de l'API depuis .env =", apiUrl);

      if (!apiUrl) {
        console.log("❌ ERREUR : L'URL de l'API est undefined !");
        Alert.alert(
          "Erreur",
          "L'URL de l'API n'est pas définie dans le fichier .env",
        );
        return;
      }

      const fullUrl = `${apiUrl}/ping`;
      console.log("ÉTAPE 2 : Requête envoyée à l'adresse complète =", fullUrl);

      const response = await fetch(fullUrl);

      console.log("ÉTAPE 3 : Réponse reçue ! Statut HTTP =", response.status);

      const textData = await response.text();
      console.log("ÉTAPE 4 : Contenu brut de la réponse =", textData);

      let data;
      try {
        data = JSON.parse(textData) as { message?: string };
        console.log("ÉTAPE 5 : Contenu transformé en JSON avec succès =", data);
      } catch (parseError) {
        console.log("❌ ERREUR : Le backend n'a pas renvoyé du JSON valide.");
        Alert.alert(
          "Erreur",
          "Le serveur n'a pas renvoyé du JSON. Regarde la console.",
        );
        return;
      }

      if (response.ok) {
        console.log("ÉTAPE 6 : TOUT EST OK !");
        Alert.alert(
          "Succès ! 🎉",
          `Le back a répondu : ${data.message || "pas de message"}`,
        );
      } else {
        console.log("❌ ERREUR HTTP :", response.status);
        Alert.alert("Erreur du serveur", `Statut HTTP : ${response.status}`);
      }
    } catch (error) {
      console.log("\n=== ❌ ERREUR RÉSEAU CATCHÉE ===");
      console.log(
        "Impossible de faire le fetch. Voici l'erreur brute :",
        error,
      );

      if (error instanceof Error) {
        console.log("Message d'erreur :", error.message);
      }

      Alert.alert(
        "Erreur ❌",
        "Impossible de joindre le backend. Regarde les logs dans la console.",
      );
    }

    console.log("=== FIN DU TEST DE CONNEXION ===\n");
  };

  const historyData = [
    {
      id: 1,
      name: "Soirée Pizza",
      date: "12 Oct",
      score: "4",
      color: "#A78BFA",
    },
    {
      id: 2,
      name: "Anniv Thomas",
      date: "20 Oct",
      score: "5",
      color: "#FDE047",
    },
    { id: 3, name: "Barathon", date: "25 Oct", score: "3", color: "#F472B6" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="black" />
          </View>
          <Text style={styles.username}>Nom d’utilisateur</Text>
        </View>

        {/* --- CARTE ACTIONS --- */}
        <View style={styles.actionCardWrapper}>
          <View style={styles.actionCardShadow} />
          <View style={styles.actionCardContent}>
            {/* BOUTON DE TEST TEMPORAIRE */}
            <NeoButton
              text="TEST API"
              color="#6EE7B7"
              iconName="pulse"
              onPress={testConnection}
            />

            <NeoButton
              text="Créer"
              color="#FDE047"
              iconName="add"
              onPress={() => router.push("/create-party")}
            />

            <NeoButton
              text="Rejoindre"
              color="#F472B6"
              iconName="people"
              onPress={() => console.log("Rejoindre")}
            />
          </View>
        </View>

        {/* --- HISTORIQUE --- */}
        <View style={styles.listContainer}>
          {historyData.map((item) => (
            <HistoryItem
              key={item.id}
              name={item.name}
              date={item.date}
              score={item.score}
              color={item.color}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, alignItems: "center" },
  header: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#A78BFA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    marginBottom: 15,
  },
  username: { fontSize: 28, fontWeight: "900", color: "black" },
  actionCardWrapper: {
    width: "100%",
    height: 180,
    position: "relative",
    marginBottom: 40,
  },
  actionCardShadow: {
    position: "absolute",
    top: 10,
    left: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "#6EE7B7",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
  },
  actionCardContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
  },
  listContainer: { width: "100%", paddingBottom: 40 },
});
