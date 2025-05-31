import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { fetchUniversities } from "@/services/university.service";
import { updateUniversity } from "@/services/auth.service";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Colors } from "@/constants/Colors";
import { University } from "@/types/university.types";
import { setUniversityId } from "@/utils/authStorage";

export default function SelectUniversity() {
  const { userData, isLoading: isAuthLoading } = useAuthToken();
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        if (!userData.accessToken) return;
        const data = await fetchUniversities(userData.accessToken);
        setUniversities(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load universities");
      } finally {
        setIsLoading(false);
      }
    };
    if (!isAuthLoading) {
      loadUniversities();
    }
  }, [userData, isAuthLoading]);

  const handleNext = async () => {
    if (!selectedUniversity) {
      Alert.alert("Error", "Please select a university");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateUniversity(userData.accessToken, selectedUniversity);
      await setUniversityId(selectedUniversity);
      router.replace("/");
    } catch (error) {
      console.error("Update university error:", error);
      Alert.alert("Error", "Failed to update university");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.highlight} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>
        Select Your University
      </Text>
      <Picker
        selectedValue={selectedUniversity}
        onValueChange={setSelectedUniversity}
        style={{ marginBottom: 32 }}
      >
        <Picker.Item label="Select a university..." value={undefined} />
        {universities.map((u) => (
          <Picker.Item key={u.id} label={u.name} value={u.id} />
        ))}
      </Picker>
      <Pressable
        style={{
          backgroundColor: Colors.highlight,
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          opacity: isSubmitting ? 0.7 : 1,
        }}
        onPress={handleNext}
        disabled={isSubmitting}
      >
        <Text style={{ color: Colors.text, fontWeight: "bold", fontSize: 16 }}>
          {isSubmitting ? "Saving..." : "Next"}
        </Text>
      </Pressable>
    </View>
  );
}
