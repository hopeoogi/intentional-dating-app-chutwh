
import { Stack } from 'expo-router';

export default function WaitlistLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="application" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="pending" />
    </Stack>
  );
}
