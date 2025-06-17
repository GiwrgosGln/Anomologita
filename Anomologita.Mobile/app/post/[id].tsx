import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";

export default function PostDetails() {
  const { id, postData } = useLocalSearchParams();
  const post = postData ? JSON.parse(postData as string) : null;
  console.log(post.imageUrl);
  return (
    <SafeAreaView style={styles.safeArea}>
      {post.imageUrl && (
        <View>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            onError={(error) => console.log("Image load error:", error)}
            onLoad={() => console.log("Image loaded successfully")}
          />
        </View>
      )}
      <Text>{post.content}</Text>
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
  postImage: {
    width: "100%",
    height: 300,
  },
});
