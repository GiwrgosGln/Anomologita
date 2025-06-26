import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { fetchComments, createComment } from "@/services/comment.service";
import { Comment } from "@/types/comment.types";
import { useValidAccessToken } from "@/hooks/useValidAccessToken";
import { formatUtcToLocal, getRelativeTime } from "@/utils/dateTime";

export default function PostDetails() {
  const { id, postData } = useLocalSearchParams();
  const post = postData ? JSON.parse(postData as string) : null;
  const router = useRouter();
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const getValidAccessToken = useValidAccessToken();

  const fetchPostComments = async () => {
    if (!post?.id) return;

    try {
      setLoading(true);
      const accessToken = await getValidAccessToken();
      if (!accessToken) return;

      const response = await fetchComments(accessToken, post.id);
      // Sort comments chronologically (oldest first, newest last)
      const sortedComments = response.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [post?.id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSendComment = async () => {
    if (!commentInput.trim() || !post?.id) return;

    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) return;

      await createComment(accessToken, {
        content: commentInput.trim(),
        postId: post.id,
      });

      // Clear input and refetch comments to get updated list
      setCommentInput("");
      await fetchPostComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  console.log(postData);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {post.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.postImage}
              onError={(error) => console.log("Image load error:", error)}
              onLoad={() => console.log("Image loaded successfully")}
            />
            <View style={styles.backButtonContainer}>
              <BlurView intensity={30} style={styles.blurBackButton}>
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </Pressable>
              </BlurView>
            </View>
          </View>
        )}
        {!post.imageUrl && (
          <View style={styles.backButtonNoImage}>
            <Pressable onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
          </View>
        )}
        <View style={styles.contentContainer}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{post.username}</Text>
            <Text style={styles.university}>{post.universityShortName}</Text>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>
          <Text style={styles.timestamp}>
            {getRelativeTime(post.createdAt)}
          </Text>
        </View>

        <View style={styles.commentsSection}>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor={Colors.text + "60"}
              value={commentInput}
              onChangeText={setCommentInput}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[
                styles.sendButton,
                { opacity: commentInput.trim() ? 1 : 0.5 },
              ]}
              onPress={handleSendComment}
              disabled={!commentInput.trim()}
            >
              <Ionicons name="send" size={20} color={Colors.text} />
            </Pressable>
          </View>

          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading comments...</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUsername}>
                    @{comment.username}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <Text style={styles.commentTimestamp}>
                  {getRelativeTime(comment.createdAt)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  imageContainer: {
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  backButtonContainer: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 1,
  },
  blurBackButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonNoImage: {
    padding: 20,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  university: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    opacity: 0.7,
    backgroundColor: Colors.text + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.5,
    marginTop: 8,
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.text + "08",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    minHeight: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.6,
    textAlign: "center",
    paddingVertical: 20,
  },
  commentItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.text + "10",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  commentUniversity: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text,
    opacity: 0.6,
    backgroundColor: Colors.text + "12",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    marginBottom: 8,
  },
  commentTimestamp: {
    fontSize: 11,
    color: Colors.text,
    opacity: 0.4,
  },
});
