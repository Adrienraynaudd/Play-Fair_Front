import { Ionicons } from "@expo/vector-icons";
// On remplace BarCodeScanner par CameraView et Camera
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import NeoButton from "../components/NeoButton";
import NeoInput from "../components/NeoInput";
import { roomService } from "../services/rooms";

export default function JoinPartyScreen() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScannerOpen(false);
    setCode(data);
    Alert.alert("QR scanné", `Code détecté : ${data}`);
  };

  const handleJoinParty = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      Alert.alert("Erreur", "Veuillez saisir un code de soirée.");
      return;
    }

    setIsLoading(true);
    try {      
      setIsLoading(false);
      const redirectUrl = "https://www.youtube.com/watch?v=xvFZjo5PgG0";
      await Linking.openURL(redirectUrl);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert("Erreur", "Impossible de rejoindre la soirée.");
    }
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permission refusée", "L'accès à la caméra est nécessaire.");
        return;
      }
    }
    setScannerOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejoindre une soirée</Text>
      <Text style={styles.subtitle}>Entrez le code ou scannez le QR code.</Text>

      <NeoInput
        text="Code de la soirée"
        color="#A78BFA"
        value={code}
        onChangeText={setCode}
        height={60}
      />

      <View style={styles.buttonContainer}>
        <NeoButton
          text="Scanner QR"
          color="#6EE7B7"
          iconName="qr-code-outline"
          onPress={openScanner}
          height={60}
          width={250}
          orientation="row"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#FDE047" />
      ) : (
        <NeoButton
          text="Rejoindre"
          color="#FDE047"
          iconName="log-in-outline"
          onPress={handleJoinParty}
          height={60}
          width={250}
          orientation="row"
        />
      )}

      {scannerOpen && permission?.granted && (
        <View style={styles.scannerOverlay}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={scannerOpen ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"], 
            }}
          />
          
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Placez le QR code dans le cadre</Text>
          </View>

          <TouchableOpacity
            style={styles.scannerCancel}
            onPress={() => setScannerOpen(false)}
          >
            <Ionicons name="close" size={24} color="black" />
            <Text style={styles.scannerCancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  scannerHeader: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scannerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  scannerCancel: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "black",
  },
  scannerCancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },
});
