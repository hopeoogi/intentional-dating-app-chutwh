
import React from 'react';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function TabsLayout() {
  const tabs: TabBarItem[] = [
    {
      route: '/(tabs)/(home)',
      label: 'Matches',
      ios_icon_name: 'heart.fill',
      android_material_icon_name: 'favorite',
    },
    {
      route: '/(tabs)/conversations',
      label: 'Chats',
      ios_icon_name: 'message.fill',
      android_material_icon_name: 'chat',
    },
    {
      route: '/(tabs)/profile',
      label: 'Profile',
      ios_icon_name: 'person.fill',
      android_material_icon_name: 'person',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="conversations" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
