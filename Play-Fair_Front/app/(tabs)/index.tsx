import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Pour les icônes (Bonhomme, Plus, Groupe)

export default function App() {
  
  const historyData = [
    { id: 1, name: "Soirée Pizza", date: "12 Oct", score: "4.5", color: "#A78BFA" }, // Violet
    { id: 2, name: "Anniv Thomas", date: "20 Oct", score: "5.0", color: "#FDE047" }, // Jaune
    { id: 3, name: "Barathon", date: "25 Oct", score: "3.2", color: "#F472B6" },    // Rose
    { id: 4, name: "Jeux de société", date: "30 Oct", score: "4.8", color: "#6EE7B7" }, // Vert
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="black" />
          </View>
          <Text style={styles.username}>Nom d’utilisateur</Text>
        </View>

        {/* --- ACTION CARD (Le bloc blanc avec ombre verte) --- */}
        <View style={styles.actionCardWrapper}>
            {/* L'ombre verte décalée */}
            <View style={styles.actionCardShadow} />
            {/* La carte blanche au dessus */}
            <View style={styles.actionCardContent}>
              
              {/* --- BOUTON JAUNE (Avec Wrapper) --- */}
  <View style={styles.actionBtnWrapper}>
    {/* L'ombre noire manuelle */}
    <View style={styles.actionBtnShadow} />
    
    {/* Le bouton cliquable */}
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FDE047' }]}>
      <Text style={styles.actionBtnText}>Créer une soirée</Text>
      <View style={styles.circleIcon}>
          <Ionicons name="add" size={24} color="white" />
      </View>
    </TouchableOpacity>
  </View>

  {/* --- BOUTON ROSE (Avec Wrapper) --- */}
  <View style={styles.actionBtnWrapper}>
    {/* L'ombre noire manuelle */}
    <View style={styles.actionBtnShadow} />

    {/* Le bouton cliquable */}
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F472B6' }]}>
      <Text style={styles.actionBtnText}>Rejoindre une soirée</Text>
      <View style={styles.groupIcon}>
          <Ionicons name="people" size={32} color="black" />
      </View>
    </TouchableOpacity>
  </View>

            </View>
        </View>

        {/* --- SEPARATOR --- */}
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Historique</Text>
          <View style={styles.line} />
        </View>

        {/* --- LISTE HISTORIQUE --- */}
        <View style={styles.listContainer}>
          {historyData.map((item) => (
            // On crée un Wrapper (conteneur) pour superposer les éléments
            <View key={item.id} style={styles.cardWrapper}>
              
              {/* 1. L'OMBRE (Le rectangle noir derrière) */}
              <View style={[styles.cardShadow, { backgroundColor: 'black' }]} />
              
              {/* 2. LA CARTE (Devant) */}
              <View style={[styles.cardContent, { backgroundColor: item.color }]}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemDate}>Date: {item.date}</Text>
                <Text style={styles.itemScore}>{item.score}</Text>
              </View>
              
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fond blanc général
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  
  // HEADER
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // Cercle parfait
    backgroundColor: '#A78BFA', // Violet avatar
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black',
    // Ombre noire dure
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10, // Pour Android
    marginBottom: 15,
  },
  username: {
    fontSize: 28,
    fontWeight: '900',
    color: 'black',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  // ACTION CARD (Le bloc blanc complexe)
  actionCardWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
    marginBottom: 40,
  },
  actionCardShadow: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: '100%',
    height: '100%',
    backgroundColor: '#6EE7B7', // Vert menthe
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
  },
  actionCardContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
  },
  
  // ACTION BUTTONS (Carrés Jaune et Rose)
  actionButton: {
    width: 130,
    height: 130,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    // Ombre noire dure sous les boutons
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  circleIcon: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 5,
  },
  groupIcon: {
    backgroundColor: 'transparent',
  },
  
  // SEPARATOR
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 3,
    backgroundColor: 'black',
  },
  separatorText: {
    fontSize: 24,
    fontWeight: '900',
    marginHorizontal: 15,
    color: 'black',
  },

  // LISTE
  listContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
    // L'effet 3D "Shadow" en bas à droite
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0, // Sur Android on gère ça autrement pour avoir le côté "sharp", mais ici on simplifie
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '35%',
  },
  itemDate: {
    fontWeight: '600',
    fontSize: 14,
  },
  itemScore: {
    fontWeight: '900',
    fontSize: 16,
  },
  // NOUVEAUX STYLES POUR LA LISTE
  cardWrapper: {
    width: '100%',
    height: 80, // Hauteur fixe nécessaire pour bien caler l'ombre
    marginBottom: 20,
    position: 'relative', // Important pour la superposition
  },
  cardShadow: {
    position: 'absolute', // On le sort du flux
    top: 6,  // Décalage vers le bas
    left: 6, // Décalage vers la droite
    width: '100%',
    height: '100%',
    borderRadius: 15,
    // Pas de bordure ici, juste un bloc noir
  },
  cardContent: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
  },
  // --- ACTION BUTTONS ---
  
  // 1. Le conteneur qui tient tout (taille fixe ici)
  actionBtnWrapper: {
    width: 130,
    height: 130,
    position: 'relative', // Indispensable pour superposer
  },

  // 2. L'ombre noire derrière
  actionBtnShadow: {
    position: 'absolute',
    top: 4,   // Décalage vers le bas
    left: 4,  // Décalage vers la droite
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 15,
  },

  
});