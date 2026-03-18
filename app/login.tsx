import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import NeoInput from "../components/NeoInput";
import NeoButton from "../components/NeoButton";


export default function LoginScreen() {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");

      const handleRegister = () => {
    router.push("/");
  };

    const color1 = "#A78BFA";
  const color2 = "#FDE047";
  const color3 = "#F472B6";
  const color4 = "#6EE7B7";

  return (
    <View style={styles.container}>
        <Image
            source={require("../assets/images/logo.png")}
            style={{
             width: 260,
             height: 300,
            alignSelf: "center",
            marginBottom: 10,
            }}
        />
      <Text style={styles.title}>Se connecter</Text>
 <NeoInput
        text="Nom d'utilisateur"
        color= {color4}
        onChangeText={setUsername}
        value={username}
        height={60}

      />
      <NeoInput
        text="Mot de passe"
        color={color1}
        onChangeText={setPassword}
        value={password}
        height={60}
        secureTextEntry={true}
      />

      <Text style={{ fontSize: 12, color: "#888", textAlign: "center", marginBottom: 20 }}>
        Pas encore de compte ? <Text style={{fontWeight: "bold" }} onPress={() => router.push('/register')}>Créer en un !</Text>
      </Text>
      <NeoButton text="Connexion" onPress={handleRegister} color={color2} iconName="checkmark" height={60} orientation="row"/>
    </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
});
