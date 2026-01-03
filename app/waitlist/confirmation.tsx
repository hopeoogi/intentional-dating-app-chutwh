
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';

export default function ConfirmationScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={80}
              color="#4CAF50"
            />
          </View>

          <Text style={styles.title}>Application Submitted!</Text>
          
          <Text style={styles.message}>
            Thank you for your interest in Intentional. We're reviewing your application and will get back to you soon.
          </Text>

          <Text style={styles.subMessage}>
            Keep an eye on your email for updates about your application status.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/auth/sign-in')}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  subMessage: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
});
