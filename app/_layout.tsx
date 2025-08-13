// RootLayout.tsx
import { UserDetailContext } from "@/context/UserDetailContext";
import { Stack } from "expo-router";
import { useState } from "react";
import type { UserDetail } from "@/context/UserDetailContext";

export default function RootLayout() {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <Stack>
        <Stack.Screen name="auth" options={{ title: "Authentication" }} />
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </UserDetailContext.Provider>
  );
}
