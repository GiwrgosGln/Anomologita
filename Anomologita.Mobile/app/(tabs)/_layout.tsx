import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, StyleSheet, Pressable, PressableProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";

const TabBarButton = (props: PressableProps) => {
  return <Pressable {...props} android_ripple={null} />;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.highlight,
        tabBarInactiveTintColor: Colors.text,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 60,
          paddingTop: 5,
          borderTopWidth: 0.2,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          shadowColor: "rgba(47, 64, 85, 1)",
          shadowRadius: 10,
          backgroundColor: Colors.backgroundAccent,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.12,
        },
        tabBarButton: (props) => <TabBarButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons name="home-outline" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add_post"
        options={{
          title: "Add Post",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
          tabBarLabel: () => null,
          tabBarButton: (props) => <TabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons name="person-circle-outline" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "relative",
    alignItems: "center",
    bottom: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
