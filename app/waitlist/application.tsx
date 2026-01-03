
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { BACKEND_URL } from '@/utils/api';
import { IconSymbol } from '@/components/IconSymbol';
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

const RELATIONSHIP_GOALS = [
  'Long-term partner',
  'Life partner',
  'Marriage',
  'Serious relationship',
  'Committed relationship',
  'Monogamous relationship',
  'Open relationship',
  'Polyamorous',
  'Dating casually',
  'New friends',
  'Activity partner',
  'Travel companion',
  'Creative collaboration',
  'Networking',
  'Figuring it out',
  'Short-term fun',
  'Something casual',
  'Friends with benefits',
  'Hookups',
  'Open to anything',
  'Let\'s see where it goes',
];

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    country: '',
    city: '',
    email: '',
    phone: '',
    lookingFor: [] as string[],
    additionalInfo: '',
  });

  const toggleLookingFor = (option: string) => {
    if (formData.lookingFor.includes(option)) {
      setFormData({
        ...formData,
        lookingFor: formData.lookingFor.filter(item => item !== option),
      });
    } else {
      if (formData.lookingFor.length < 5) {
        setFormData({
          ...formData,
          lookingFor: [...formData.lookingFor, option],
        });
      } else {
        Alert.alert('Maximum Selection', 'You can select up to 5 options');
      }
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Required Field', 'Please enter your name');
      return;
    }
    
    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      Alert.alert('Invalid Age', 'Please enter a valid age (18-100)');
      return;
    }

    if (!formData.country.trim()) {
      Alert.alert('Required Field', 'Please enter your country');
      return;
    }

    if (!formData.city.trim()) {
      Alert.alert('Required Field', 'Please enter your city');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (formData.lookingFor.length === 0) {
      Alert.alert('Required Field', 'Please select at least one option for what you\'re looking for');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          age: ageNum,
          location: `${formData.city.trim()}, ${formData.country.trim()}`,
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          lookingFor: formData.lookingFor.join(', '),
          additionalInfo: formData.additionalInfo.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      router.replace('/waitlist/pending');
    } catch (error: any) {
      console.error('Application submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Unable to submit your application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/c16dda65-bb0d-4cb6-ba78-d87103621eb0.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Join Intentional</Text>
              <Text style={styles.subtitle}>
                Apply to join our community of intentional daters
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  autoCapitalize="words"
                />
              </View>

              {/* Age */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={formData.age}
                  onChangeText={(text) => setFormData({ ...formData, age: text })}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={formData.country}
                  onChangeText={(text) => setFormData({ ...formData, country: text })}
                  autoCapitalize="words"
                />
                <TextInput
                  style={[styles.input, styles.inputSpacing]}
                  placeholder="City / Region"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  autoCapitalize="words"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              {/* What are you looking for */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>What are you looking for? *</Text>
                <Text style={styles.helperText}>Select up to 5 options</Text>
                <View style={styles.optionsGrid}>
                  {RELATIONSHIP_GOALS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        formData.lookingFor.includes(option) && styles.optionButtonSelected,
                      ]}
                      onPress={() => toggleLookingFor(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          formData.lookingFor.includes(option) && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Additional Info */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tell us more (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Anything else you&apos;d like us to know..."
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={formData.additionalInfo}
                  onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </TouchableOpacity>
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
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
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
  inputSpacing: {
    marginTop: 8,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionButtonSelected: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  optionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});
