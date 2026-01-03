
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConfirmationScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Application Received!</Text>

          <Text style={styles.message}>
            Your application has been successfully received and you are now on
            our waitlist. We will contact you when your application has been
            approved.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/waitlist/sign-in')}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
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
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
