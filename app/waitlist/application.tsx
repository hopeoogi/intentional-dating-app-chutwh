
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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { apiPost } from '@/utils/api';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  'Monogamous relationship',
  'Partnership',
  'Soulmate',
  'Meaningful connection',
  'Exclusive dating',
  'Future-focused dating',
  'Intentional dating',
  'Authentic connection',
  'Long-term commitment',
  'Building something real',
  'Finding love',
];

const MAX_SELECTIONS = 5;

export default function ApplicationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [provinceState, setProvinceState] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter((item) => item !== option));
    } else {
      if (lookingFor.length < MAX_SELECTIONS) {
        setLookingFor([...lookingFor, option]);
      } else {
        Alert.alert('Maximum Selections', `You can select up to ${MAX_SELECTIONS} options.`);
      }
    }
  };

  const handleSubmit = async () => {
    console.log('[Application] Starting submission...');
    
    // Validation
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your name.');
      return;
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      Alert.alert('Invalid Age', 'Please enter a valid age (18-100).');
      return;
    }

    if (!city.trim() || !provinceState.trim()) {
      Alert.alert('Required Field', 'Please enter your city and province/state.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (lookingFor.length === 0) {
      Alert.alert('Required Field', 'Please select at least one relationship goal.');
      return;
    }

    setSubmitting(true);

    try {
      const location = `${city.trim()}, ${provinceState.trim()}`;
      
      const applicationData = {
        name: name.trim(),
        age: ageNum,
        location,
        email: email.trim(),
        phone: phone.trim() || undefined,
        lookingFor,
        additionalInfo: additionalInfo.trim() || undefined,
      };

      console.log('[Application] Submitting data:', applicationData);

      // TODO: Backend Integration - Submit application to /api/waitlist/apply endpoint
      const response = await apiPost('/api/waitlist/apply', applicationData);

      console.log('[Application] Submission successful:', response);

      Alert.alert(
        'Application Submitted!',
        'Thank you for applying. We will review your application and get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/waitlist/confirmation'),
          },
        ]
      );
    } catch (error: any) {
      console.error('[Application] Submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Unable to submit your application. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo - Your Intentional logo */}
            <Image
              source={require('@/assets/images/a5c86ed3-6460-4f6d-a333-47f2974b9f7d.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Join Intentional</Text>
            <Text style={styles.subtitle}>Tell us about yourself</Text>

            {/* Name */}
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#666"
            />

            {/* Age */}
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Your age"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />

            {/* Location - City, Province/State */}
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#666"
            />
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              value={provinceState}
              onChangeText={setProvinceState}
              placeholder="Province/State"
              placeholderTextColor="#666"
            />

            {/* Email */}
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Phone */}
            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Your phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            {/* What are you looking for? - 21 options, up to 5 selections */}
            <Text style={styles.label}>
              What are you looking for? * (Select up to {MAX_SELECTIONS})
            </Text>
            <Text style={styles.selectionCount}>
              {lookingFor.length} / {MAX_SELECTIONS} selected
            </Text>
            <View style={styles.optionsContainer}>
              {RELATIONSHIP_GOALS.map((option) => {
                const isSelected = lookingFor.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                    onPress={() => toggleLookingFor(option)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Additional Info */}
            <Text style={styles.label}>Tell us more (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholder="Anything else you'd like us to know..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#1a1a1a" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputSpacing: {
    marginTop: 12,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  selectionCount: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionButtonSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
