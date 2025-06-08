import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { fetchUser } from "@/services/auth.service";
import { FetchUserResponse } from "@/types/auth.types";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useValidAccessToken } from "@/hooks/useValidAccessToken";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

export default function Profile() {
  const { loading: authLoading } = useAuth();
  const getValidAccessToken = useValidAccessToken();
  const [user, setUser] = useState<FetchUserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        try {
          setLoading(true);
          const token = await getValidAccessToken();

          if (!token) {
            setError("Not logged in");
            setLoading(false);
            return;
          }

          const userDataRes = await fetchUser(token);
          setUser(userDataRes);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          setError("Couldn't load profile data");
        } finally {
          setLoading(false);
        }
      };

      if (!authLoading) getUserData();
    }, [authLoading])
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : user ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.universityName}>
              {user.universityName} ({user.universityShortName})
            </Text>
          </View>

          {user.posts && user.posts.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Posts</Text>
                <Text style={styles.sectionSubtext}>
                  You've made {user.posts.length} posts
                </Text>
              </View>

              {user.posts.map((post) => (
                <View key={post.id} style={styles.card}>
                  <Text style={styles.postContent}>{post.content}</Text>

                  {post.imageUrl && (
                    <Image
                      source={{ uri: post.imageUrl }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  )}

                  {post.createdAt && (
                    <Text style={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              ))}
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Posts</Text>
              <Text style={styles.emptyText}>
                You haven't created any posts yet
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>No user data available</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginVertical: 32,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 5,
  },
  avatarText: {
    fontSize: 44,
    fontWeight: "bold",
    color: Colors.background,
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 6,
  },
  universityName: {
    fontSize: 16,
    color: Colors.textAccent,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.highlight,
  },
  sectionSubtext: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 2,
  },
  postContent: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
    lineHeight: 22,
  },
  postImage: {
    width: width - 64,
    height: width - 64,
    borderRadius: 8,
    marginBottom: 12,
  },
  postDate: {
    fontSize: 12,
    color: "#888888",
    textAlign: "right",
    marginTop: 4,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#AAAAAA",
    fontStyle: "italic",
  },
});
