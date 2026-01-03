
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');

export default function ConfirmationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={48} color="#ffffff" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Application Received</Text>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                Your application is being processed and you are on a waitlist.
              </Text>
              <Text style={styles.message}>
                Please be patient—we will contact you when your application is approved.
              </Text>
            </View>

            {/* Info Cards */}
            <View style={styles.infoCards}>
              <View style={styles.infoCard}>
                <IconSymbol ios_icon_name="envelope.fill" android_material_icon_name="email" size={24} color="#ffffff" />
                <Text style={styles.infoText}>Check your email for updates</Text>
              </View>

              <View style={styles.infoCard}>
                <IconSymbol ios_icon_name="clock.fill" android_material_icon_name="schedule" size={24} color="#ffffff" />
                <Text style={styles.infoText}>Review typically takes 2-3 days</Text>
              </View>

              <View style={styles.infoCard}>
                <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={24} color="#ffffff" />
                <Text style={styles.infoText}>Limited spots available</Text>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#ffffff', '#f0f0f0']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footer}>
              Thank you for your interest in Intentional
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#ffffff',
    marginBottom: 24,
    letterSpacing: 1,
  },
  messageContainer: {
    marginBottom: 48,
    maxWidth: 340,
  },
  message: {
    fontSize: 17,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  infoCards: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 48,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#ffffff',
    marginLeft: 16,
    flex: 1,
  },
  button: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
