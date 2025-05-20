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
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { register } from "@/services/auth.service";

export default function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        username,
        email,
        password,
        confirmPassword,
      });

      console.log("Registration successful");
      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully. Please log in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        "There was an error creating your account. Please try again."
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>{t("app_name")}</Text>
          <Text style={styles.tagline}>
            {t("register_subtitle") || "Create an Account"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={Colors.textAccent}
            />
            <TextInput
              style={styles.input}
              placeholder={t("username")}
              placeholderTextColor={Colors.text + "80"}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.textAccent} />
            <TextInput
              style={styles.input}
              placeholder={t("email")}
              placeholderTextColor={Colors.text + "80"}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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
              placeholder={t("password")}
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

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={Colors.textAccent}
            />
            <TextInput
              style={styles.input}
              placeholder={t("confirm_password")}
              placeholderTextColor={Colors.text + "80"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.text}
              />
            </Pressable>
          </View>

          {/* Register Button */}
          <Pressable
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.text} />
            ) : (
              <Text style={styles.loginButtonText}>
                {t("register_button") || "Register"}
              </Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Login Option */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              {t("register_have_account") || "Already have an account?"}{" "}
            </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={styles.registerLink}>
                {t("register_login_link") || "Login"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
