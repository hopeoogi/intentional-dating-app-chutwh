
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';

export default function WaitlistSignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.title}>Join the Waitlist</Text>
          <Text style={styles.subtitle}>Be among the first to experience intentional dating</Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/waitlist/application')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gradient: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#999', marginBottom: 48 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
