
import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to waitlist application after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/waitlist/application');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Image - loaded from local assets for fast loading */}
      <Image
        source={require('@/assets/images/1a782e7d-0165-4270-bbc7-3a0d29c7b7d7.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Dark overlay for better text visibility */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      />
      
      {/* Company Name */}
      <View style={styles.contentContainer}>
        <Text style={styles.appName}>Intentional</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    width,
    height,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 52,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 12,
  },
});
