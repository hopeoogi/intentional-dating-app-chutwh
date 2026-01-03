
import { Stack } from 'expo-router';
import React from 'react';

export default function WaitlistLayout() {
  console.log('[Waitlist Layout] Initializing waitlist stack navigation');
  
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen 
        name="welcome" 
        options={{ 
          title: 'Welcome',
        }} 
      />
      <Stack.Screen 
        name="sign-in" 
        options={{ 
          title: 'Sign In',
        }} 
      />
      <Stack.Screen 
        name="application" 
        options={{ 
          title: 'Application',
        }} 
      />
      <Stack.Screen 
        name="confirmation" 
        options={{ 
          title: 'Confirmation',
          gestureEnabled: false, // Prevent swipe back
        }} 
      />
      <Stack.Screen 
        name="pending" 
        options={{ 
          title: 'Pending',
          gestureEnabled: false, // Prevent swipe back
        }} 
      />
    </Stack>
  );
}
