import {
    CameraView,
    useCameraPermissions,
    type BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NeoButton from "../components/NeoButton";
import NeoInput from "../components/NeoInput";
import { extractRoomJoinCode } from "../services/room-share";
import { roomService } from "../services/rooms";

type JoinMode = "code" | "scan";

export default function JoinPartyScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [joinMode, setJoinMode] = useState<JoinMode>("code");
  const [code, setCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const handleJoin = async (incomingCode?: string) => {
    const roomCode = (incomingCode ?? code).trim();

    if (!roomCode) {
      Alert.alert("Code requis", "Saisissez ou scannez un code de soirée.");
      return;
    }

    setIsJoining(true);

    try {
      const data = await roomService.joinRoom(roomCode);
      const joinedRoom = data?.room ?? data?.joinedRoom ?? null;

      Alert.alert("Soirée rejointe", "Vous avez bien rejoint la soirée.");

      if (joinedRoom?.id) {
        router.replace({
          pathname: "/home-party",
          params: {
            id: joinedRoom.id,
            name: joinedRoom.name ?? "Soirée",
            roomCode: joinedRoom.roomCode ?? roomCode,
            rulesGroupId:
              joinedRoom.rulesGroupId ?? joinedRoom.rules_group_id ?? "",
          },
        });
        return;
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error?.response?.data?.message ||
          "Impossible de rejoindre cette soirée pour le moment.",
      );
      setHasScanned(false);
    } finally {
      setIsJoining(false);
    }
  };

  const handleScan = async ({ data }: BarcodeScanningResult) => {
    if (hasScanned || isJoining) {
      return;
    }

    const scannedCode = extractRoomJoinCode(data);

    if (!scannedCode) {
      Alert.alert(
        "QR invalide",
        "Le QR code scanné ne contient pas de code de soirée.",
      );
      return;
    }

    setHasScanned(true);
    setCode(scannedCode);
    await handleJoin(scannedCode);
  };

  const switchJoinMode = async (mode: JoinMode) => {
    if (mode === "scan" && Platform.OS === "web") {
      Alert.alert(
        "Indisponible",
        "Le scan QR est disponible uniquement sur mobile.",
      );
      return;
    }

    if (mode === "scan" && !permission?.granted) {
      const response = await requestPermission();

      if (!response.granted) {
        Alert.alert(
          "Caméra requise",
          "Autorisez la caméra pour scanner un QR code de soirée.",
        );
        return;
      }
    }

    setHasScanned(false);
    setJoinMode(mode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rejoindre une soirée</Text>
        <Text style={styles.subtitle}>
          Utilisez un code manuel ou scannez le QR affiché par l&apos;hôte.
        </Text>

        <View style={styles.switcherRow}>
          <ModeChip
            label="Code"
            isActive={joinMode === "code"}
            onPress={() => switchJoinMode("code")}
          />
          <ModeChip
            label="QR code"
            isActive={joinMode === "scan"}
            onPress={() => switchJoinMode("scan")}
          />
        </View>

        {joinMode === "code" ? (
          <View style={styles.panel}>
            <NeoInput
              text="Code de la soirée"
              color="#FDE047"
              value={code}
              onChangeText={setCode}
              width={320}
              height={58}
            />

            {isJoining ? (
              <ActivityIndicator size="large" color="#F472B6" />
            ) : (
              <NeoButton
                text="Rejoindre"
                color="#F472B6"
                iconName="enter-outline"
                width={220}
                height={58}
                orientation="row"
                onPress={() => handleJoin()}
              />
            )}
          </View>
        ) : (
          <View style={styles.panel}>
            <View style={styles.cameraFrame}>
              {permission?.granted ? (
                <CameraView
                  style={styles.camera}
                  barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                  onBarcodeScanned={handleScan}
                />
              ) : (
                <View style={styles.cameraFallback}>
                  <Text style={styles.cameraFallbackText}>
                    Autorisation caméra nécessaire pour scanner le QR code.
                  </Text>
                </View>
              )}
            </View>

            <Pressable
              onPress={() => setHasScanned(false)}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>Scanner à nouveau</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function ModeChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.modeChip,
        isActive ? styles.modeChipActive : styles.modeChipInactive,
      ]}
    >
      <Text style={styles.modeChipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 28,
    textAlign: "center",
    color: "#444",
    lineHeight: 22,
  },
  switcherRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  modeChip: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#000",
    paddingVertical: 14,
    alignItems: "center",
  },
  modeChipActive: {
    backgroundColor: "#6EE7B7",
  },
  modeChipInactive: {
    backgroundColor: "#fff",
  },
  modeChipText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  panel: {
    width: "100%",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#000",
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 22,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  cameraFrame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#000",
    backgroundColor: "#111",
  },
  camera: {
    flex: 1,
  },
  cameraFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cameraFallbackText: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
  },
  helperText: {
    marginTop: 16,
    textAlign: "center",
    color: "#444",
    lineHeight: 22,
  },
  linkButton: {
    marginTop: 12,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F472B6",
  },
});
