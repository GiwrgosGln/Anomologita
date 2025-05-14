import { Stack } from "expo-router";
import "../i18n";

export default function RootLayout() {
  return (
    <Stack initialRouteName="(auth)">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
