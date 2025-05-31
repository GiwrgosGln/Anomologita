import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="select-university" options={{ headerShown: false }} />
    </Stack>
  );
}
