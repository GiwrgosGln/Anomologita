import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useTranslation } from "@/node_modules/react-i18next";
import { fetchPosts } from "@/services";
import { Post } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useFocusEffect } from "expo-router";

export default function Index() {
  const { t } = useTranslation();
  const { userData, isLoading, hasError } = useAuthToken();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPosts = async (token: string, page = 1, refresh = false) => {
    try {
      if (!token) return;
      const postsData = await fetchPosts(token, page);

      if (refresh) {
        setPosts(postsData);
      } else {
        const newPostIds = new Set(postsData.map((post) => post.id));
        const filteredCurrentPosts = posts.filter(
          (post) => !newPostIds.has(post.id)
        );
        setPosts([...filteredCurrentPosts, ...postsData]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (userData.accessToken) {
      loadPosts(userData.accessToken, 1, true);
    }
  }, [userData.accessToken]);

  useFocusEffect(
    useCallback(() => {
      if (userData.accessToken) {
        loadPosts(userData.accessToken, 1, true);
      }
      console.log("Posts screen focused, loading posts...");
    }, [userData.accessToken])
  );

  const handleRefresh = () => {
    if (!userData.accessToken) return;
    setIsRefreshing(true);
    setCurrentPage(1);
    loadPosts(userData.accessToken, 1, true);
  };

  const handleLoadMore = () => {
    if (!userData.accessToken || isLoading || isRefreshing) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPosts(userData.accessToken, nextPage);
  };

  const formatPostDate = (dateString: string): string => {
    const postDate = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 0
          ? "Just now"
          : `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      const day = postDate.getDate().toString().padStart(2, "0");
      const month = (postDate.getMonth() + 1).toString().padStart(2, "0");
      const year = postDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.username?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>
              {item.username || "Anonymous"}
            </Text>
            <Text style={styles.postDate}>
              {formatPostDate(item.createdAt)}
            </Text>
          </View>
        </View>

        {item.universityShortName && (
          <View style={styles.universityBadge}>
            <Text style={styles.universityText}>
              {item.universityShortName}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* TODO: Implement like, comment, and share functionality
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color="#8E8E93" />
          <Text style={styles.actionText}>0</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#8E8E93" />
          <Text style={styles.actionText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
        */}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#16161a" />
      <View style={styles.container}>
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7F5AF0" />
          </View>
        ) : hasError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#E53E3E" />
            <Text style={styles.errorText}>Failed to load posts</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadPosts(userData.accessToken, currentPage, true)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={(item, index) => `post-${item.id}-${index}`}
            contentContainerStyle={styles.postsList}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#7F5AF0"
                colors={["#7F5AF0"]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={48} color="#8E8E93" />
                <Text style={styles.emptyText}>No posts yet</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#16161a",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#16161a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2e2e35",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fffffe",
  },
  profileButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#fffffe",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#7F5AF0",
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: "#fffffe",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#94a1b2",
    textAlign: "center",
  },
  postsList: {
    padding: 10,
  },
  postCard: {
    backgroundColor: "#242629",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7F5AF0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fffffe",
    fontSize: 16,
    fontWeight: "bold",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fffffe",
  },
  postDate: {
    fontSize: 12,
    color: "#94a1b2",
  },
  universityBadge: {
    backgroundColor: "#2e2e35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  universityText: {
    color: "#7F5AF0",
    fontSize: 12,
    fontWeight: "600",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fffffe",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 15,
    color: "#94a1b2",
    marginBottom: 16,
    lineHeight: 22,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#2e2e35",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    color: "#94a1b2",
    marginLeft: 6,
    fontSize: 14,
  },
});
