
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiPost } from '@/utils/api';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Life partner',
  'Serious dating',
  'Companionship',
  'Deep connection',
  'Emotional intimacy',
  'Building a family',
  'Shared values',
  'Mutual growth',
  'Authentic connection',
  'Meaningful conversations',
  'Shared adventures',
  'Intellectual connection',
  'Spiritual connection',
  'Creative partnership',
  'Travel companion',
  'Best friend',
  'Soulmate',
  'Committed relationship',
  'Exclusive dating',
];

export default function ApplicationScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [provinceState, setProvinceState] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter((item) => item !== option));
    } else {
      if (lookingFor.length < 5) {
        setLookingFor([...lookingFor, option]);
      } else {
        Alert.alert('Maximum Selection', 'You can select up to 5 options only.');
      }
    }
  };

  const handleSubmit = async () => {
    console.log('[Application] Submit button pressed');
    
    // Validation
    if (!firstName.trim() || !lastName.trim() || !age.trim() || !city.trim() || 
        !provinceState.trim() || !country.trim() || !email.trim() || lookingFor.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      Alert.alert('Invalid Age', 'Please enter a valid age (18-100).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    console.log('[Application] Submitting application...');

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: ageNum,
        city: city.trim(),
        provinceState: provinceState.trim(),
        country: country.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        lookingFor,
        additionalInfo: additionalInfo.trim() || undefined,
      };

      console.log('[Application] Payload:', payload);

      const response = await apiPost('/api/waitlist/apply', payload);

      console.log('[Application] Response received:', response);

      // Check if response indicates success
      // The backend returns { success: true, message: string, applicationId: string }
      if (response && (response.success === true || response.applicationId)) {
        console.log('[Application] Success! Navigating to confirmation...');
        // Use replace instead of push to prevent going back to the form
        router.replace('/waitlist/confirmation');
      } else {
        console.error('[Application] Unexpected response format:', response);
        Alert.alert('Error', response.message || 'Failed to submit application. Please try again.');
      }
    } catch (error: any) {
      console.error('[Application] Submission error:', error);
      Alert.alert(
        'Submission Error', 
        error.message || 'Failed to submit application. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
      console.log('[Application] Loading state cleared');
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.container}>
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
            <Image
              source={require('@/assets/images/final_quest_240x240.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Join the Waitlist</Text>
            <Text style={styles.subtitle}>
              Fill out the form below to join our exclusive community
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#666"
                editable={!loading}
              />

              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#666"
                editable={!loading}
              />

              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                editable={!loading}
              />

              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter your city"
                placeholderTextColor="#666"
                editable={!loading}
              />

              <Text style={styles.label}>Province/State *</Text>
              <TextInput
                style={styles.input}
                value={provinceState}
                onChangeText={setProvinceState}
                placeholder="Enter your province or state"
                placeholderTextColor="#666"
                editable={!loading}
              />

              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor="#666"
                editable={!loading}
              />

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                editable={!loading}
              />

              <Text style={styles.label}>
                What are you looking for? * (Select up to 5)
              </Text>
              <Text style={styles.selectionCount}>
                {lookingFor.length}/5 selected
              </Text>
              <View style={styles.optionsContainer}>
                {RELATIONSHIP_GOALS.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      lookingFor.includes(option) && styles.optionSelected,
                    ]}
                    onPress={() => toggleLookingFor(option)}
                    disabled={loading}
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

              <Text style={styles.label}>Additional Information (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Tell us more about yourself..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#000" />
                    <Text style={styles.loadingText}>Submitting...</Text>
                  </View>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
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
    textAlignVertical: 'top',
  },
  selectionCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});
