
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/d45a04a7-5fce-423f-af69-1e7c41804f69.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Image
              source={require('@/assets/images/260cc1c3-9577-4d6b-bb49-5785013cf9ac.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => router.push('/waitlist/application')}
              >
                <Text style={styles.joinButtonText}>Join Waitlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  logo: {
    width: width * 0.6,
    height: 120,
    marginTop: 40,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  joinButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  joinButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
