
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';
import { BACKEND_URL } from '@/utils/api';

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    phone: '',
    lookingFor: '',
    additionalInfo: '',
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.age || !formData.location || !formData.email || !formData.lookingFor) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18) {
      Alert.alert('Invalid Age', 'You must be 18 or older to apply.');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      console.log('[Waitlist] Submitting application to:', `${BACKEND_URL}/api/waitlist/apply`);
      
      const response = await fetch(`${BACKEND_URL}/api/waitlist/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          location: formData.location,
          email: formData.email,
          phone: formData.phone || undefined,
          lookingFor: formData.lookingFor,
          additionalInfo: formData.additionalInfo || undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Waitlist] Application submission failed:', response.status, errorText);
        
        if (response.status === 409) {
          Alert.alert('Already Applied', 'This email has already been submitted. We\'ll be in touch soon!');
          return;
        }
        
        throw new Error(`Application failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Waitlist] Application submitted successfully:', data);
      router.replace('/waitlist/confirmation');
    } catch (error: any) {
      console.error('[Waitlist] Application submission error:', error);
      
      if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        Alert.alert('Connection Error', 'Unable to submit application. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>

              <Text style={styles.title}>Join Intentional</Text>
              <Text style={styles.subtitle}>
                Tell us about yourself to join our exclusive community
              </Text>

              {/* Form */}
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Enter your name"
                    placeholderTextColor="#666666"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.age}
                    onChangeText={(text) => setFormData({ ...formData, age: text })}
                    placeholder="18+"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                    placeholder="City, State/Country"
                    placeholderTextColor="#666666"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="your@email.com"
                    placeholderTextColor="#666666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="+1 (555) 123-4567"
                    placeholderTextColor="#666666"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>What are you looking for? *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.lookingFor}
                    onChangeText={(text) => setFormData({ ...formData, lookingFor: text })}
                    placeholder="Describe what you're seeking in a partner..."
                    placeholderTextColor="#666666"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Additional Information (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.additionalInfo}
                    onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
                    placeholder="Anything else you'd like us to know..."
                    placeholderTextColor="#666666"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={loading ? ['#666666', '#555555'] : ['#ffffff', '#f0f0f0']}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#000000" />
                  ) : (
                    <Text style={styles.buttonText}>Submit Application</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                * Required fields. By submitting, you agree to our terms and privacy policy.
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
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
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
