import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import NeoButton from "../components/NeoButton";
import NeoInput from "../components/NeoInput";
import { authService } from "../services/auth";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await authService.register(username, email, password);
      Alert.alert("Succès ! 🎉", "Votre compte a été créé avec succès.");
      router.replace("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Une erreur est survenue lors de l'inscription.";
      Alert.alert("Erreur d'inscription", errorMessage);
    }
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
      <Text style={styles.title}>Créer un compte</Text>

      <NeoInput
        text="Email"
        color={color4}
        onChangeText={setEmail}
        value={email}
        height={60}
      />
      <NeoInput
        text="Nom d'utilisateur"
        color={color3}
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
      <NeoInput
        text="Confirmer le mot de passe"
        color={color1}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        height={60}
        secureTextEntry={true}
      />

      <Text
        style={{
          fontSize: 12,
          color: "#888",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Déjà un compte ?{" "}
        <Text
          style={{ fontWeight: "bold" }}
          onPress={() => router.push("/login")}
        >
          Connecte-toi
        </Text>
      </Text>

      <NeoButton
        text="S'inscrire"
        onPress={handleRegister}
        color={color2}
        iconName="checkmark"
        height={60}
        orientation="row"
      />
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
});
