
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('[Waitlist Welcome] Screen mounted');
    
    const timer = setTimeout(() => {
      console.log('[Waitlist Welcome] Navigating to sign-in...');
      router.replace('/waitlist/sign-in');
    }, 3000);

    return () => {
      console.log('[Waitlist Welcome] Cleaning up timer');
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/20a729de-51e9-4557-ad66-b94976427a0c.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Intentional</Text>
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
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
});
