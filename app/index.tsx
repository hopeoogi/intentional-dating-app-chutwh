
import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('[Welcome] Screen mounted, will navigate in 3 seconds');
    const timer = setTimeout(() => {
      console.log('[Welcome] Navigating to sign-in');
      router.replace('/auth/sign-in');
    }, 3000);

    return () => {
      console.log('[Welcome] Cleaning up timer');
      clearTimeout(timer);
    };
  }, []);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#000000']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('../assets/images/natively-dark.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Intentional</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});
