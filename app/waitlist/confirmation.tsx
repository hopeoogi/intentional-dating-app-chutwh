
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    lineHeight: 28,
  },
});

export default function ConfirmationScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <LinearGradient colors={['#000', '#1a1a1a']} style={styles.gradient}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.title}>Application Received</Text>
        <Text style={styles.message}>
          Your application is being processed and you are on the waitlist. We will contact you when your application is approved.
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}
