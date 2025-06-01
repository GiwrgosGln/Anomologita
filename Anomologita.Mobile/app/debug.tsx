import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { useTranslation } from "@/node_modules/react-i18next";
import * as Localization from "expo-localization";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function Debug() {
  const { t } = useTranslation();
  const router = useRouter();
  const localeInfo = Localization.getLocales()[0];
  const { authData, setAuthData } = useAuth();

  const handleLogout = async () => {
    try {
      await setAuthData(null);
      Alert.alert("Success", "All authentication data has been cleared");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An unexpected error occurred during logout");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("welcome")}</Text>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <Text style={styles.infoText}>Language: {localeInfo.languageCode}</Text>
        <Text style={styles.infoText}>Region: {localeInfo.regionCode}</Text>
        <Text style={styles.infoText}>
          Currency: {localeInfo.currencySymbol}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Authentication Data</Text>
        {authData ? (
          <>
            <Text style={styles.infoText}>Username: {authData.username}</Text>
            <Text style={styles.infoText}>User ID: {authData.userId}</Text>
            <Text style={styles.infoText}>
              University ID: {authData.universityId || "Not available"}
            </Text>
            <Text style={styles.infoText}>
              Access Token Expiry: {authData.accessTokenExpiry}
            </Text>
            <Text style={styles.infoText}>
              Refresh Token Expiry: {authData.refreshTokenExpiry}
            </Text>

            <Text style={styles.tokenLabel}>Access Token:</Text>
            <Text
              style={styles.tokenText}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {authData.accessToken}
            </Text>

            <Text style={styles.tokenLabel}>Refresh Token:</Text>
            <Text
              style={styles.tokenText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {authData.refreshToken}
            </Text>
          </>
        ) : (
          <Text style={styles.infoText}>No authentication data available.</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Logout / Clear Auth Data"
          onPress={handleLogout}
          color="#d9534f"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 12,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  buttonContainer: {
    marginVertical: 16,
    gap: 12,
  },
});
