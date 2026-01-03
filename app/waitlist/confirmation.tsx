
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ConfirmationScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('[Confirmation] ========== SCREEN MOUNTED ==========');
    console.log('[Confirmation] Screen rendered successfully at:', new Date().toISOString());
    console.log('[Confirmation] Router object:', router);
    
    return () => {
      console.log('[Confirmation] Screen unmounting');
    };
  }, []);

  const handleDone = () => {
    console.log('[Confirmation] Done button pressed');
    console.log('[Confirmation] Navigating to home screen');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={['#000000', '#1a1a1a', '#0a0a0a']} style={styles.gradient}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={100} 
              color={colors.primary} 
            />
          </View>

          {/* Success Message */}
          <Text style={styles.title}>You&apos;re on the list!</Text>
          <Text style={styles.subtitle}>
            Thank you for joining our waitlist. We&apos;ll notify you when your spot is ready.
          </Text>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <IconSymbol 
              ios_icon_name="envelope.fill" 
              android_material_icon_name="email" 
              size={24} 
              color="rgba(255,255,255,0.7)" 
            />
            <Text style={styles.infoText}>
              Check your email for updates on your application status
            </Text>
          </View>
          
          {/* Done Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>

          {/* Debug Info */}
          <Text style={styles.debugText}>
            Confirmation screen loaded successfully ✓
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  gradient: { 
    flex: 1 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 17, 
    color: '#999', 
    marginBottom: 40, 
    textAlign: 'center', 
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    marginLeft: 12,
  },
  button: { 
    backgroundColor: colors.primary, 
    paddingHorizontal: 64, 
    paddingVertical: 18, 
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  debugText: {
    marginTop: 32,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
