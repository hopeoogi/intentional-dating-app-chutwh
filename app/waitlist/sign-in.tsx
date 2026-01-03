
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
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

          <Text style={styles.title}>Welcome to Intentional</Text>
          <Text style={styles.description}>
            A conversation-first dating experience. No swipes, no games—just
            meaningful connections.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/waitlist/application')}
          >
            <Text style={styles.buttonText}>Apply to Join</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    width: width - 64,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
