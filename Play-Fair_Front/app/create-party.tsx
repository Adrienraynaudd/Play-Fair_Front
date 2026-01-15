import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import NeoButton from '../components/NeoButton';

export default function CreatePartyScreen() {
  const router = useRouter(); 
  
  const rules = [
    { id: 1, color: '#FDE047' }, // Jaune
    { id: 2, color: '#F472B6' }, // Rose
    { id: 3, color: '#A78BFA' }, // Violet
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* --- TITRE --- */}
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: '900' }}>Nouvelle Soirée</Text>
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
            <ActionButton label="Ajouter" icon="add" />
            <ActionButton label="Importer" icon="download-outline" />
            <ActionButton label="Exporter" icon="share-outline" />
        </View>

        {/* --- LISTE DES RÈGLES --- */}
        <View style={styles.rulesContainer}>
            {rules.map((rule, index) => (
                <RuleRow key={index} color={rule.color} />
            ))}
        </View>

        {/* --- BOUTON VALIDER --- */}
        <View style={{ marginTop: 30, alignItems: 'flex-end', width: '100%' }}>
            <NeoButton 
                text="Valider" 
                color="#FDE047" 
                iconName="checkmark" 
                onPress={() => router.back()} 
            />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- SOUS-COMPOSANTS ---

interface ActionButtonProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const ActionButton = ({ label, icon }: ActionButtonProps) => (
    <View style={styles.smallBtnWrapper}>
        <View style={[styles.shadow, { backgroundColor: 'black' }]} />
        <TouchableOpacity style={styles.smallBtn}>
            <Text style={styles.smallBtnText}>{label}</Text>
            <View style={styles.blackIconCircle}>
                <Ionicons name={icon} size={16} color="white" />
            </View>
        </TouchableOpacity>
    </View>
);

const RuleRow = ({ color }: { color: string }) => (
    <View style={styles.ruleWrapper}>
        <View style={[styles.shadow, { backgroundColor: 'black' }]} />
        <View style={[styles.ruleCard, { backgroundColor: color }]}>
            
            {/* Colonne Inputs */}
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

            {/* Colonne Points */}
            <View style={styles.pointsColumn}>
                <TouchableOpacity><Ionicons name="caret-back" size={24} color="black" /></TouchableOpacity>
                <View style={styles.scoreBox}>
                    <Text style={styles.scoreText}>10</Text>
                    <Text style={styles.ptsLabel}>pts</Text>
                </View>
                <TouchableOpacity><Ionicons name="caret-forward" size={24} color="black" /></TouchableOpacity>
            </View>

        </View>
    </View>
);

// --- STYLES CORRIGÉS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  
  shadow: {
    position: 'absolute', top: 4, left: 4, width: '100%', height: '100%',
    backgroundColor: 'black', borderRadius: 15,
  },

  // Titre Input
  titleInputWrapper: { height: 80, width: '100%', marginBottom: 30 },
  mainInput: {
    flex: 1, backgroundColor: '#A78BFA', borderRadius: 15, borderWidth: 3,
    borderColor: 'black', paddingHorizontal: 20, fontSize: 20, fontWeight: 'bold',
    textAlign: 'center',
  },

  // Actions
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  smallBtnWrapper: { width: '31%', height: 60 },
  smallBtn: {
    flex: 1, backgroundColor: '#6EE7B7', borderRadius: 12, borderWidth: 3,
    borderColor: 'black', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 5
  },
  smallBtnText: { fontSize: 11, fontWeight: 'bold', marginRight: 4 },
  blackIconCircle: { backgroundColor: 'black', borderRadius: 10, padding: 2 },

  // Règles
  rulesContainer: { width: '100%', gap: 20 },
  
  // MODIFIÉ : Hauteur augmentée pour tout faire rentrer (120 -> 135)
  ruleWrapper: { height: 135, width: '100%' },
  
  ruleCard: {
    flex: 1, borderRadius: 15, borderWidth: 3, borderColor: 'black',
    flexDirection: 'row', padding: 10, alignItems: 'center'
  },
  inputsColumn: { flex: 2, marginRight: 10 },
  
  // MODIFIÉ : Hauteur 35 -> 40 et plus de padding
  whiteInputContainer: {
    backgroundColor: 'white', borderRadius: 20, borderWidth: 2, borderColor: 'black',
    paddingHorizontal: 15, height: 40, justifyContent: 'center', 
    shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.1, elevation: 2
  },
  
  // MODIFIÉ : Hauteur 100% et centrage vertical pour éviter le texte coupé
  minimalInput: { 
      fontSize: 13, 
      fontWeight: '600', 
      height: '100%', 
      textAlignVertical: 'center',
      color: 'black' 
  },
  
  pointsColumn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  scoreBox: {
    backgroundColor: 'white', borderWidth: 2, borderColor: 'black', borderRadius: 10,
    padding: 5, alignItems: 'center', minWidth: 40
  },
  scoreText: { fontWeight: '900', fontSize: 16 },
  ptsLabel: { fontSize: 8, fontWeight: 'bold' }
});