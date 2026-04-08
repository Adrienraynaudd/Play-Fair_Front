import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryItem from "../../components/HistoryItem";
import NeoButton from "../../components/NeoButton";
import { roomService } from "../../services/rooms";

export default function HomeScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colors = ["#A78BFA", "#FDE047", "#F472B6", "#6EE7B7"];

  const fetchRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des soirées:", error);
      Alert.alert("Erreur", "Impossible de charger vos soirées.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRooms();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("fr-FR", { month: "short" });
    return `${day} ${month.replace(".", "")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="black" />
          </View>
          <Text style={styles.username}>Mon Profil</Text>
        </View>

        {/* --- CARTE ACTIONS --- */}
        <View style={styles.actionCardWrapper}>
            <View style={styles.actionCardShadow} />
            <View style={styles.actionCardContent}>
              <Text style={{fontWeight: "bold" }} onPress={() => router.push('../home-party')}>test</Text>
              <NeoButton 
                text="Créer une soirée" 
                color="#FDE047" 
                iconName="add" 
                onPress={() => router.push('/create-party')} 
              />

              <NeoButton 
                text="Rejoindre une soirée" 
                color="#F472B6" 
                iconName="people" 
                onPress={() => console.log("Rejoindre")}
              />
              
            </View>
        </View>

        {/* --- HISTORIQUE DYNAMIQUE --- */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Mes dernières soirées</Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#A78BFA"
              style={{ marginTop: 20 }}
            />
          ) : rooms.length > 0 ? (
            rooms.map((item, index) => (
              <HistoryItem
                key={item.id}
                name={item.name}
                date={formatDate(item.date)}
                score={item.membersCount?.toString() || "0"}
                color={colors[index % colors.length]}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              Vous n'avez pas encore de soirée.
            </Text>
          )}
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
    height: 160,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontStyle: "italic",
  },
});
