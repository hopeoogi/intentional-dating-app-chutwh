
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';

export default function ConfirmationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={80} 
              color="#4CAF50" 
            />
          </View>

          <Text style={styles.title}>You&apos;re on the list!</Text>
          <Text style={styles.message}>
            Thank you for applying to Intentional. We&apos;ll review your application and
            get back to you soon.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoText}>
              • Our team will review your application{'\n'}
              • You&apos;ll receive an email within 3-5 business days{'\n'}
              • Once approved, you&apos;ll get access to the app
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/waitlist/sign-in')}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 17,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#999',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
});
