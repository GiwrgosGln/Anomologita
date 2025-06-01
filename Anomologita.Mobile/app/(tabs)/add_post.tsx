import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { createPost } from "@/services/post.service";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useValidAccessToken } from "@/hooks/useValidAccessToken";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageDetails, setImageDetails] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const router = useRouter();
  const getValidAccessToken = useValidAccessToken();

  // Request media library permissions and pick image
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImage(selectedImage.uri);

        const uriParts = selectedImage.uri.split(".");
        const fileExtension = uriParts[uriParts.length - 1];

        setImageDetails({
          uri: selectedImage.uri,
          name: `post_image_${Date.now()}.${fileExtension}`,
          type: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImageDetails(null);
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content for your post");
      return;
    }

    setLoading(true);

    try {
      const accessToken = await getValidAccessToken();

      if (!accessToken) {
        Alert.alert("Error", "You are not logged in");
        return;
      }

      await createPost(accessToken, content, imageDetails || undefined);

      setContent("");
      setImage(null);
      setImageDetails(null);

      Alert.alert("Success", "Post created successfully", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)"),
        },
      ]);
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create New Post</Text>

          {/* Post content input */}
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor="#888888"
            multiline
            numberOfLines={5}
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />

          {/* Image preview section */}
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <Ionicons name="close-circle" size={24} color="#FF5C5C" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <MaterialIcons
                name="add-photo-alternate"
                size={28}
                color="#6C63FF"
              />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </TouchableOpacity>
          )}

          {/* Submit button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!content.trim() || loading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!content.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    borderStyle: "dashed",
    padding: 20,
    marginBottom: 24,
  },
  imagePickerText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333",
  },
  imagePreview: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    backgroundColor: "#1E1E1E",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  submitButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#444444",
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
