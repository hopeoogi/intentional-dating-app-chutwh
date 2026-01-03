
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';

export default function ConfirmationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.checkCircle}>
            <IconSymbol 
              ios_icon_name="checkmark" 
              android_material_icon_name="check" 
              size={48} 
              color="#fff" 
            />
          </View>
        </View>

        <Text style={styles.title}>Application Submitted!</Text>
        
        <Text style={styles.message}>
          Your application has been received and you&apos;ve been added to our waitlist.
        </Text>

        <Text style={styles.submessage}>
          We&apos;ll review your application and contact you when you&apos;re approved.
        </Text>

        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="info.circle" 
            android_material_icon_name="info" 
            size={20} 
            color="#666" 
          />
          <Text style={styles.infoText}>
            Check your email for confirmation and updates
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)')}
      >
        <LinearGradient
          colors={['#000', '#333']}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Done</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 32,
    lineHeight: 26,
  },
  submessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
