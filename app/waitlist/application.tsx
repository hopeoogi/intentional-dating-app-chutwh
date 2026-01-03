
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { apiPost, BACKEND_URL, isBackendConfigured } from '@/utils/api';

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

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter((item) => item !== option));
    } else {
      setLookingFor([...lookingFor, option]);
    }
  };

  const handleSubmit = async () => {
    console.log('[Application] Starting submission...');
    
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 18) {
      Alert.alert('Error', 'Please enter a valid age (18+)');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (lookingFor.length === 0) {
      Alert.alert('Error', 'Please select at least one relationship goal');
      return;
    }

    // Check backend configuration
    if (!isBackendConfigured()) {
      console.error('[Application] Backend not configured');
      Alert.alert(
        'Configuration Error',
        'Backend is not configured. Please contact support.'
      );
      return;
    }

    console.log('[Application] Backend URL:', BACKEND_URL);
    console.log('[Application] Submitting data:', {
      name: name.trim(),
      age: Number(age),
      location: location.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      lookingFor,
      additionalInfo: additionalInfo.trim() || undefined,
    });

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        age: Number(age),
        location: location.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        lookingFor,
        additionalInfo: additionalInfo.trim() || undefined,
      };

      console.log('[Application] Calling API with payload:', payload);
      
      const response = await apiPost('/api/waitlist/apply', payload);

      console.log('[Application] Application submitted successfully:', response);
      
      // Navigate to confirmation
      router.push('/waitlist/confirmation');
    } catch (error: any) {
      console.error('[Application] Submission error:', error);
      console.error('[Application] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('Backend URL not configured')) {
        errorMessage = 'App is not properly configured. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Submission Error', errorMessage);
    } finally {
      setLoading(false);
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
                <Text style={styles.label}>What are you looking for? *</Text>
                <Text style={styles.helperText}>Select all that apply</Text>
                <View style={styles.optionsGrid}>
                  {RELATIONSHIP_GOALS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionChip,
                        lookingFor.includes(option) && styles.optionChipSelected,
                      ]}
                      onPress={() => toggleLookingFor(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          lookingFor.includes(option) && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
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
  optionText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#000',
    fontWeight: '600',
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
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
