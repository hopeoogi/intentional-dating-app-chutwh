
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';

export default function PendingScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Image
            source={require('@/assets/images/c16dda65-bb0d-4cb6-ba78-d87103621eb0.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check-circle" size={80} color="#4ade80" />
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.title}>Application Received!</Text>
            <Text style={styles.message}>
              Your application is being reviewed. You&apos;ve been added to our waitlist.
            </Text>
            <Text style={styles.submessage}>
              We&apos;ll contact you when your application is approved. Thank you for your patience!
            </Text>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <IconSymbol ios_icon_name="info.circle" android_material_icon_name="info" size={24} color="rgba(255,255,255,0.7)" />
            <Text style={styles.infoText}>
              Check your email for updates on your application status
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  submessage: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
});
