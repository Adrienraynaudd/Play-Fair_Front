import { View, Text, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        router.push('/'); 
    }

 return (
     <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={{ width: 300, height: 300, alignSelf: 'center', marginBottom: 100 }} />
      <Text style={styles.title}>Créer un compte</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {/* bouton pour etre rediriger */}
        <Pressable onPress={handleRegister} style={{ backgroundColor: '#FDE047', padding: 15, borderRadius: 8, marginTop: 20 }}>
          <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}>S'inscrire</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
});