import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import NeoButton from "../components/NeoButton";
import NeoInput from "../components/NeoInput";
import { authService } from "../services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setIsLoading(false);
      router.replace("/");
    } catch (error: any) {
      setIsLoading(false);
      if (!error.response) {
        Alert.alert(
          "Erreur Réseau",
          "Le serveur est injoignable. Vérifie que ton PC et ton téléphone sont sur le même réseau et que l'IP dans le .env est correcte."
        );
      } else {
        const errorMessage = error.response?.data?.error || "Email ou mot de passe incorrect.";
        Alert.alert("Erreur de connexion", errorMessage);
      }
    }
  };

  const color1 = "#A78BFA";
  const color2 = "#FDE047";
  const color4 = "#6EE7B7";

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Se connecter</Text>

      <NeoInput
        text="Email"
        color={color4}
        onChangeText={setEmail}
        value={email}
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

      <Text style={styles.footerText}>
        Pas encore de compte ?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/register")}
        >
          Créer en un !
        </Text>
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={color2} />
      ) : (
        <NeoButton
          text="Connexion"
          onPress={handleLogin}
          color={color2}
          iconName="checkmark"
          height={60}
          orientation="row"
        />
      )}
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
  logo: {
    width: 260,
    height: 300,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    fontWeight: "bold",
  },
});