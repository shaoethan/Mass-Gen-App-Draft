import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "ActiPain Tracker",
        headerBackTitle: "Back",
      }}
    />
  );
}
