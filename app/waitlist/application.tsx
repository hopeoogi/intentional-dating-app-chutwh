
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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { apiPost, BACKEND_URL, isBackendConfigured } from '@/utils/api';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Dating',
  'Friendship',
  'Not sure yet',
];

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    phone: '',
    additionalInfo: '',
  });
  const [lookingFor, setLookingFor] = useState<string[]>([]);

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter((item) => item !== option));
    } else {
      setLookingFor([...lookingFor, option]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!formData.age || parseInt(formData.age) < 18) {
      Alert.alert('Error', 'You must be at least 18 years old');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (lookingFor.length === 0) {
      Alert.alert('Error', 'Please select at least one relationship goal');
      return;
    }

    // Check backend configuration
    if (!isBackendConfigured()) {
      Alert.alert(
        'Configuration Error',
        'Backend is not configured. Please contact support.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await apiPost('/api/waitlist/apply', {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        location: formData.location.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        lookingFor: lookingFor,
        additionalInfo: formData.additionalInfo.trim() || undefined,
      });

      console.log('Application submitted successfully:', response);
      router.replace('/waitlist/confirmation');
    } catch (error: any) {
      console.error('Application submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Unable to submit application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Join Intentional</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself to join our exclusive community
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder="Your full name"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) =>
                  setFormData({ ...formData, age: text.replace(/[^0-9]/g, '') })
                }
                placeholder="18+"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                maxLength={2}
              />

              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                placeholder="City, State"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                placeholder="your@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>What are you looking for? *</Text>
              <View style={styles.optionsContainer}>
                {RELATIONSHIP_GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.option,
                      lookingFor.includes(goal) && styles.optionSelected,
                    ]}
                    onPress={() => toggleLookingFor(goal)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        lookingFor.includes(goal) && styles.optionTextSelected,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>
                Tell us more about yourself (Optional)
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.additionalInfo}
                onChangeText={(text) =>
                  setFormData({ ...formData, additionalInfo: text })
                }
                placeholder="What makes you unique?"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  optionTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});
