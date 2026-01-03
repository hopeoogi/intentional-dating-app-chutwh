
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/1a782e7d-0165-4270-bbc7-3a0d29c7b7d7.jpeg')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Intentional</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/waitlist/sign-in')}
        >
          <Text style={styles.buttonText}>Join Our Community</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
