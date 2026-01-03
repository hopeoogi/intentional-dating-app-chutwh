
import { Stack } from 'expo-router';

export default function WaitlistLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="application" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
