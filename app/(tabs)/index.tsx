import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeoButton from '../../components/NeoButton';
import HistoryItem from '../../components/HistoryItem';

export default function HomeScreen() {
  const router = useRouter();

  const historyData = [
    { id: 1, name: "Soirée Pizza", date: "12 Oct", score: "4", color: "#A78BFA" },
    { id: 2, name: "Anniv Thomas", date: "20 Oct", score: "5", color: "#FDE047" },
    { id: 3, name: "Barathon", date: "25 Oct", score: "3", color: "#F472B6" },
    { id: 4, name: "Jeux de société", date: "30 Oct", score: "4", color: "#6EE7B7" },
    { id: 5, name: "Soirée cinéma", date: "05 Nov", score: "5", color: "#A78BFA" },
    { id: 6, name: "Soirée jeux vidéo", date: "12 Nov", score: "3", color: "#FDE047" },
    { id: 7, name: "Soirée karaoke", date: "19 Nov", score: "4", color: "#F472B6" },
    { id: 8, name: "Soirée jeux de rôle", date: "26 Nov", score: "5", color: "#A78BFA" },
    { id: 9, name: "Soirée cinéma", date: "03 Dec", score: "4", color: "#FDE047" },
    { id: 10, name: "Soirée jeux vidéo", date: "10 Dec", score: "3", color: "#F472B6" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header*/}
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
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#A78BFA', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'black', shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 10, marginBottom: 15 },
  username: { fontSize: 28, fontWeight: '900', color: 'black' },
  actionCardWrapper: { width: '100%', height: 180, position: 'relative', marginBottom: 40 },
  actionCardShadow: { position: 'absolute', top: 10, left: 10, width: '100%', height: '100%', backgroundColor: '#6EE7B7', borderRadius: 20, borderWidth: 3, borderColor: 'black' },
  actionCardContent: { width: '100%', height: '100%', backgroundColor: 'white', borderRadius: 20, borderWidth: 3, borderColor: 'black', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 15 },
  listContainer: { width: '100%', paddingBottom: 40 },
});