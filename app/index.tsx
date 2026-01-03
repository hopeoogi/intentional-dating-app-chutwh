
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/final_quest_240x240.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* App Name */}
            <Text style={styles.appName}>Intentional</Text>
            <Text style={styles.tagline}>Dating with Purpose</Text>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                Join an exclusive community where meaningful connections begin with genuine conversation.
              </Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/waitlist/application')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#ffffff', '#f0f0f0']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Apply to Join the Community</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footer}>
              Limited access • Curated community • Verified members
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
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 32,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 48,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#999999',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 48,
  },
  descriptionContainer: {
    marginBottom: 64,
    maxWidth: 340,
  },
  description: {
    fontSize: 17,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },
  ctaButton: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
