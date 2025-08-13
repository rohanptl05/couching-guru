import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack  >
    <Stack.Screen name="auth" options={{ title: "Authentication" }} />
    <Stack.Screen name="index" options={{ title: "Home" }} />
  </Stack>
  );
}
