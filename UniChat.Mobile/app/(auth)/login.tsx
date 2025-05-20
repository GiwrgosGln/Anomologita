import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { login } from "@/services/auth.service";
import { storeAuthData } from "@/utils/authStorage";
import { router } from "expo-router";

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ username, password });
      console.log("Login successful");

      const storageSuccess = await storeAuthData(response);

      if (!storageSuccess) {
        Alert.alert(
          "Warning",
          "Login successful but there was an issue storing credentials securely."
        );
      }
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        "Invalid username or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>{t("app_name")}</Text>
        <Text style={styles.tagline}>{t("login_subtitle")}</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Username Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={Colors.textAccent} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.text + "80"}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={Colors.textAccent}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.text + "80"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.text}
            />
          </Pressable>
        </View>

        {/* Forgot Password */}
        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>
            {t("login_forgot_password")}
          </Text>
        </Pressable>

        {/* Login Button */}
        <Pressable
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.loginButtonText}>{t("login_button")}</Text>
          )}
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Register Option */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>{t("login_no_account")} </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>{t("login_register_link")}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.highlight,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.text,
    opacity: 0.8,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.textAccent,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.highlight,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.text + "30",
  },
  dividerText: {
    color: Colors.text + "80",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  registerText: {
    color: Colors.text,
    fontSize: 15,
  },
  registerLink: {
    color: Colors.highlightAccent,
    fontSize: 15,
    fontWeight: "600",
  },
});
