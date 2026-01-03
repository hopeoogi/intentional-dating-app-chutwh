
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  const router = useRouter();

  const handleJoinWaitlist = () => {
    console.log('[Sign-In] Join Waitlist button pressed');
    console.log('[Sign-In] Navigating to /waitlist/application');
    router.push('/waitlist/application');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/natively-dark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Intentional</Text>
          <Text style={styles.subtitle}>Dating with purpose</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleJoinWaitlist}
            >
              <Text style={styles.buttonText}>Join the Waitlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    marginBottom: 60,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
});
