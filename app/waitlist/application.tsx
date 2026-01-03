
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
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:3000';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Life partner',
  'Serious dating',
  'Companionship',
  'Friendship first',
  'Casual dating',
  'New friends',
  'Activity partner',
  'Travel companion',
  'Creative collaboration',
  'Intellectual connection',
  'Spiritual connection',
  'Cultural exchange',
  'Language practice',
  'Fitness partner',
  'Foodie friend',
  'Adventure buddy',
  'Professional networking',
  'Mentorship',
  'Open to possibilities',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
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
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionButtonSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  optionText: {
    fontSize: 14,
    color: '#fff',
  },
  optionTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    phone: '',
    lookingFor: [] as string[],
    additionalInfo: '',
  });

  const toggleLookingFor = (option: string) => {
    if (formData.lookingFor.includes(option)) {
      setFormData({
        ...formData,
        lookingFor: formData.lookingFor.filter((item) => item !== option),
      });
    } else if (formData.lookingFor.length < 5) {
      setFormData({
        ...formData,
        lookingFor: [...formData.lookingFor, option],
      });
    } else {
      Alert.alert('Maximum Reached', 'You can select up to 5 options.');
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
    if (formData.lookingFor.length === 0) {
      Alert.alert('Error', 'Please select at least one relationship goal');
      return;
    }

    setLoading(true);

    try {
      console.log('[Waitlist] Submitting application to:', `${BACKEND_URL}/api/waitlist/apply`);
      
      // Submit waitlist application to the backend API
      const response = await fetch(`${BACKEND_URL}/api/waitlist/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          age: parseInt(formData.age),
          location: formData.location.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || undefined,
          lookingFor: formData.lookingFor,
          additionalInfo: formData.additionalInfo.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Waitlist] Application submitted successfully:', data);

      // Success - navigate to confirmation
      router.replace('/waitlist/confirmation');
    } catch (error: any) {
      console.error('[Waitlist] Application submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Unable to submit your application. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.age &&
    parseInt(formData.age) >= 18 &&
    formData.location.trim() &&
    formData.email.trim().includes('@') &&
    formData.lookingFor.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={['#000', '#1a1a1a']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/ab20ad44-8729-4a6f-86c6-a7356bbf7036.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Join Intentional</Text>
              <Text style={styles.subtitle}>
                Apply to join our community of intentional daters
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#666"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor="#666"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text.replace(/[^0-9]/g, '') })}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.helperText}>Must be 18 or older</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="City, Country"
                placeholderTextColor="#666"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                autoCapitalize="words"
              />
              <Text style={styles.helperText}>e.g., Toronto, Canada</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#666"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>What are you looking for? *</Text>
              <Text style={styles.helperText}>Select up to 5 options</Text>
              <View style={[styles.optionsGrid, { marginTop: 12 }]}>
                {RELATIONSHIP_GOALS.map((goal, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      formData.lookingFor.includes(goal) && styles.optionButtonSelected,
                    ]}
                    onPress={() => toggleLookingFor(goal)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        formData.lookingFor.includes(goal) && styles.optionTextSelected,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Additional Information (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Tell us more about yourself..."
                placeholderTextColor="#666"
                value={formData.additionalInfo}
                onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!isFormValid || loading) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
