
import React, { useState, useEffect } from 'react';
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { apiPost, BACKEND_URL, isBackendConfigured, healthCheck } from '@/utils/api';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Life partner',
  'Serious dating',
  'Companionship',
  'Deep connection',
  'Emotional intimacy',
  'Building a family',
  'Finding my person',
  'Committed relationship',
  'Exclusive dating',
  'Partnership',
  'Soulmate',
  'Meaningful connection',
  'Intentional dating',
  'Authentic relationship',
  'Lasting love',
  'Growth together',
  'Shared values',
  'Long-term commitment',
  'Building something real',
];

const MAX_SELECTIONS = 5;

export default function ApplicationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend health on mount
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    console.log('[Application] Checking backend health...');
    const healthy = await healthCheck();
    setBackendHealthy(healthy);
    
    if (!healthy) {
      console.error('[Application] ❌ Backend is not healthy');
      Alert.alert(
        'Connection Issue',
        'Unable to connect to the server. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: checkBackendHealth },
          { text: 'Continue Anyway', style: 'cancel' }
        ]
      );
    } else {
      console.log('[Application] ✅ Backend is healthy');
    }
  };

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      // Allow deselecting
      setLookingFor(lookingFor.filter((item) => item !== option));
    } else if (lookingFor.length < MAX_SELECTIONS) {
      // Only allow selecting if under the limit
      setLookingFor([...lookingFor, option]);
    } else {
      // Show alert when trying to select more than 5
      Alert.alert(
        'Maximum Selections Reached',
        `You can select up to ${MAX_SELECTIONS} relationship goals. Please deselect one to choose another.`
      );
    }
  };

  const handleSubmit = async () => {
    console.log('[Application] ========================================');
    console.log('[Application] Starting submission process...');
    console.log('[Application] ========================================');
    
    // Validation
    if (!name.trim()) {
      console.log('[Application] Validation failed: name is empty');
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 18) {
      console.log('[Application] Validation failed: invalid age');
      Alert.alert('Error', 'Please enter a valid age (18+)');
      return;
    }
    if (!location.trim()) {
      console.log('[Application] Validation failed: location is empty');
      Alert.alert('Error', 'Please enter your location');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      console.log('[Application] Validation failed: invalid email');
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (lookingFor.length === 0) {
      console.log('[Application] Validation failed: no relationship goals selected');
      Alert.alert('Error', 'Please select at least one relationship goal');
      return;
    }

    console.log('[Application] ✅ All validations passed');

    // Check backend configuration
    if (!isBackendConfigured()) {
      console.error('[Application] ❌ Backend not configured');
      Alert.alert(
        'Configuration Error',
        'Backend is not configured. Please contact support.\n\nBackend URL: ' + (BACKEND_URL || 'NOT SET')
      );
      return;
    }

    console.log('[Application] ✅ Backend is configured');
    console.log('[Application] Backend URL:', BACKEND_URL);

    const payload = {
      name: name.trim(),
      age: Number(age),
      location: location.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      lookingFor,
      additionalInfo: additionalInfo.trim() || undefined,
    };

    console.log('[Application] Payload prepared:', JSON.stringify(payload, null, 2));

    setLoading(true);

    try {
      console.log('[Application] Calling API endpoint: /api/waitlist/apply');
      
      const response = await apiPost('/api/waitlist/apply', payload);

      console.log('[Application] ✅✅✅ Application submitted successfully!');
      console.log('[Application] Response:', response);
      
      // Navigate to confirmation
      console.log('[Application] Navigating to confirmation screen...');
      router.push('/waitlist/confirmation');
    } catch (error: any) {
      console.error('[Application] ❌❌❌ Submission error occurred');
      console.error('[Application] Error type:', error.constructor.name);
      console.error('[Application] Error message:', error.message);
      console.error('[Application] Error stack:', error.stack);
      
      let errorMessage = 'Failed to submit application. Please try again.';
      let errorDetails = '';
      
      if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (error.message?.includes('Network') || error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
        errorDetails = '\n\nTip: Make sure you have a stable internet connection.';
      } else if (error.message?.includes('Backend URL not configured')) {
        errorMessage = 'App is not properly configured. Please contact support.';
        errorDetails = '\n\nBackend URL: ' + (BACKEND_URL || 'NOT SET');
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
        errorDetails = '\n\nThe server took too long to respond.';
      } else if (error.message?.includes('API error')) {
        errorMessage = error.message;
        errorDetails = '\n\nPlease check your information and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('[Application] Showing error to user:', errorMessage + errorDetails);
      
      Alert.alert(
        'Submission Error', 
        errorMessage + errorDetails,
        [
          { text: 'Test Connection', onPress: checkBackendHealth },
          { text: 'Try Again', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      console.log('[Application] ========================================');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Image
                source={require('@/assets/images/natively-dark.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Join Intentional</Text>
              <Text style={styles.subtitle}>
                Tell us about yourself to join our community
              </Text>
              
              {backendHealthy === false && (
                <View style={styles.warningBanner}>
                  <Text style={styles.warningText}>⚠️ Connection issue detected</Text>
                  <TouchableOpacity onPress={checkBackendHealth}>
                    <Text style={styles.retryText}>Tap to retry</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {backendHealthy === true && (
                <View style={styles.successBanner}>
                  <Text style={styles.successText}>✅ Connected to server</Text>
                </View>
              )}
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  placeholder="18+"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location *</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, State"
                  placeholderTextColor="#666"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>What are you looking for? *</Text>
                  <Text style={styles.counter}>
                    {lookingFor.length}/{MAX_SELECTIONS} selected
                  </Text>
                </View>
                <Text style={styles.helperText}>
                  Select up to {MAX_SELECTIONS} that resonate with you
                </Text>
                <View style={styles.optionsGrid}>
                  {RELATIONSHIP_GOALS.map((option) => {
                    const isSelected = lookingFor.includes(option);
                    const isDisabled = !isSelected && lookingFor.length >= MAX_SELECTIONS;
                    
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionChip,
                          isSelected && styles.optionChipSelected,
                          isDisabled && styles.optionChipDisabled,
                        ]}
                        onPress={() => toggleLookingFor(option)}
                        disabled={isDisabled}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                            isDisabled && styles.optionTextDisabled,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tell us more (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={additionalInfo}
                  onChangeText={setAdditionalInfo}
                  placeholder="Share anything else you&apos;d like us to know..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testButton}
                onPress={checkBackendHealth}
              >
                <Text style={styles.testButtonText}>🔍 Test Server Connection</Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                By submitting, you agree to our community guidelines and privacy policy.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  warningBanner: {
    marginTop: 16,
    backgroundColor: '#ff9800',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  warningText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  retryText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  successBanner: {
    marginTop: 16,
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  successText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  optionChipSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  optionChipDisabled: {
    backgroundColor: '#0d0d0d',
    borderColor: '#222',
    opacity: 0.5,
  },
  optionText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  optionTextDisabled: {
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#555',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
