
import { Stack } from 'expo-router';
import React from 'react';

export default function WaitlistLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="application" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
