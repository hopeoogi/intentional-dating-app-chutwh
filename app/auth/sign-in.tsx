
import React from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/bff591c7-1a37-488d-8849-202d0eebec7f.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.85)', 'rgba(22, 33, 62, 0.95)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/9d78a159-4b83-473c-a4f1-55affbc6fcf0.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Intentional Dating</Text>
            <Text style={styles.description}>
              Join our exclusive community of Intentional connections. No likes or swipes anymore, no more being ghosted, only genuine relationships
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => router.push('/waitlist/application')}
            >
              <Text style={styles.joinButtonText}>Join Our Community</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              By joining, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 32,
  },
});
