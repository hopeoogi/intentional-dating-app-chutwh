
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('[Waitlist Welcome] Screen mounted');
    
    const timer = setTimeout(() => {
      console.log('[Waitlist Welcome] Auto-navigating to sign-in...');
      router.replace('/waitlist/sign-in');
    }, 5000); // Extended to 5 seconds to give users time to see the button

    return () => {
      console.log('[Waitlist Welcome] Cleaning up timer');
      clearTimeout(timer);
    };
  }, [router]);

  const handleJoinCommunity = () => {
    console.log('[Waitlist Welcome] User pressed Join our community button');
    router.push('/waitlist/sign-in');
  };

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
        <Text style={styles.subtitle}>
          Where genuine connections begin
        </Text>
        
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinCommunity}
          activeOpacity={0.8}
        >
          <Text style={styles.joinButtonText}>Join our community</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 48,
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  joinButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
