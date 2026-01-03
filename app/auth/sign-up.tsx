
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await signUpWithEmail(email, password, name);
      
      // Check if user needs to complete profile setup
      // For now, always redirect to profile setup after sign up
      router.replace('/auth/profile-setup');
    } catch (error: any) {
      console.error('[SignUp] Sign up failed:', error);
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      
      // Check if user needs to complete profile setup
      router.replace('/auth/profile-setup');
    } catch (error: any) {
      console.error('[SignUp] Google sign up failed:', error);
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    try {
      setLoading(true);
      await signInWithApple();
      
      // Check if user needs to complete profile setup
      router.replace('/auth/profile-setup');
    } catch (error: any) {
      console.error('[SignUp] Apple sign up failed:', error);
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: 'Sign Up',
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join our intentional community</Text>
            </View>
            
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password (min 8 characters)"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEmailSignUp}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignUp}
                disabled={loading}
              >
                <IconSymbol
                  ios_icon_name="g.circle.fill"
                  android_material_icon_name="login"
                  size={24}
                  color={colors.text}
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleAppleSignUp}
                  disabled={loading}
                >
                  <IconSymbol
                    ios_icon_name="apple.logo"
                    android_material_icon_name="login"
                    size={24}
                    color={colors.text}
                  />
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.back()}
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  linkTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
});
