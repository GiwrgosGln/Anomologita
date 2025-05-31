import React, { useState, useEffect } from "react";
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
import * as SecureStore from "expo-secure-store";
import { clearAuthData } from "../../utils/authStorage";
import { useRouter } from "expo-router";

export default function Debug() {
  const { t } = useTranslation();
  const router = useRouter();
  const localeInfo = Localization.getLocales()[0];
  const [userData, setUserData] = useState({
    accessToken: "",
    accessTokenExpiry: "",
    refreshToken: "",
    refreshTokenExpiry: "",
    userId: "",
    username: "",
    universityId: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuthData = async () => {
    try {
      // Fetch all auth data from secure store
      const accessToken = (await SecureStore.getItemAsync("accessToken")) || "";
      const accessTokenExpiry =
        (await SecureStore.getItemAsync("accessTokenExpiry")) || "";
      const refreshToken =
        (await SecureStore.getItemAsync("refreshToken")) || "";
      const refreshTokenExpiry =
        (await SecureStore.getItemAsync("refreshTokenExpiry")) || "";
      const userId = (await SecureStore.getItemAsync("userId")) || "";
      const username = (await SecureStore.getItemAsync("username")) || "";
      const universityId =
        (await SecureStore.getItemAsync("universityId")) || "";

      setUserData({
        accessToken,
        accessTokenExpiry,
        refreshToken,
        refreshTokenExpiry,
        userId,
        username,
        universityId,
      });
    } catch (error) {
      console.error("Error fetching auth data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  const handleLogout = async () => {
    try {
      const success = await clearAuthData();
      if (success) {
        Alert.alert("Success", "All authentication data has been cleared");
        setUserData({
          accessToken: "",
          accessTokenExpiry: "",
          refreshToken: "",
          refreshTokenExpiry: "",
          userId: "",
          username: "",
          universityId: "",
        });
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Error", "Failed to clear authentication data");
      }
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
        {isLoading ? (
          <Text>Loading authentication data...</Text>
        ) : (
          <>
            <Text style={styles.infoText}>Username: {userData.username}</Text>
            <Text style={styles.infoText}>User ID: {userData.userId}</Text>
            <Text style={styles.infoText}>
              University ID: {userData.universityId || "Not available"}
            </Text>
            <Text style={styles.infoText}>
              Access Token Expiry: {userData.accessTokenExpiry}
            </Text>
            <Text style={styles.infoText}>
              Refresh Token Expiry: {userData.refreshTokenExpiry}
            </Text>

            <Text style={styles.tokenLabel}>Access Token:</Text>
            <Text
              style={styles.tokenText}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {userData.accessToken}
            </Text>

            <Text style={styles.tokenLabel}>Refresh Token:</Text>
            <Text
              style={styles.tokenText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {userData.refreshToken}
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Logout / Clear Auth Data"
          onPress={handleLogout}
          color="#d9534f"
        />
        <Button title="Refresh Data" onPress={fetchAuthData} color="#5bc0de" />
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
