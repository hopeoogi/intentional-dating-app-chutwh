
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default function ConfirmationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('@/assets/images/ab20ad44-8729-4a6f-86c6-a7356bbf7036.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Application Received</Text>
      <Text style={styles.message}>
        Your application is being processed and you are on the waitlist.{'\n\n'}
        We will contact you when your application is approved.
      </Text>
    </SafeAreaView>
  );
}
