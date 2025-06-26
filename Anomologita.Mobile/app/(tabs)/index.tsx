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
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "@/node_modules/react-i18next";
import { fetchPosts } from "@/services";
import { Post } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import { useValidAccessToken } from "@/hooks/useValidAccessToken";
import { formatUtcToLocal, getRelativeTime } from "@/utils/dateTime";
import { Colors } from "@/constants/Colors";

export default function Index() {
  const { t } = useTranslation();
  const { loading } = useAuth();
  const router = useRouter();
  const getValidAccessToken = useValidAccessToken();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPosts = async (page = 1, refresh = false) => {
    try {
      const token = await getValidAccessToken();
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
    loadPosts(1, true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPosts(1, true);
    }, [])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    loadPosts(1, true);
  };

  const handleLoadMore = () => {
    if (loading || isRefreshing) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPosts(nextPage);
  };

  const handlePostPress = (post: Post) => {
    router.push({
      pathname: "/post/[id]",
      params: { id: post.id, postData: JSON.stringify(post) },
    });
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.9}
    >
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
              {getRelativeTime(item.createdAt)}
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

      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {item.imageUrl && (
        <View style={styles.postFooter}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={28} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={Colors.text}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.postContent}>
        <Text style={styles.postTextContainer}>
          {item.imageUrl && <Text style={styles.author}>{item.username} </Text>}
          <Text style={styles.contentText}>{item.content}</Text>
        </Text>
      </View>

      {!item.imageUrl && (
        <View style={styles.postFooter}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={28} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={Colors.text}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#16161a" />
      <View style={styles.container}>
        {loading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FEE930" />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={(item, index) => `post-${item.id}-${index}`}
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
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "android" ? 70 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fffffe",
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
  postCard: {
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderTopWidth: 0.2,
    borderColor: Colors.textAccent,
  },
  postHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: Colors.background,
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
    backgroundColor: Colors.backgroundAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  universityText: {
    color: Colors.highlight,
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
    paddingHorizontal: 16,
  },
  postTextContainer: {
    fontSize: 14,
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  author: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  contentText: {
    fontSize: 14,
    color: Colors.textAccent,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    color: "#94a1b2",
    marginLeft: 6,
    fontSize: 14,
  },
});
