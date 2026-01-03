
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/natively-dark.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/final_quest_240x240.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Intentional Dating</Text>
          <Text style={styles.subtitle}>
            Where meaningful connections begin with conversation
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/waitlist/application')}
          >
            <Text style={styles.buttonText}>Join Waitlist</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: width * 0.7,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
