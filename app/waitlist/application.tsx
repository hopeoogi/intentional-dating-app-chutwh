
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
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
import { apiPost } from '@/utils/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Casual dating',
  'Friendship',
  'Networking',
  'Travel partner',
  'Activity partner',
  'Life partner',
  'Companionship',
  'Romance',
  'Serious relationship',
  'Open to anything',
  'Something casual',
  'New friends',
  'Creative collaboration',
  'Fitness partner',
  'Dining companion',
  'Cultural experiences',
  'Adventure buddy',
  'Intellectual connection',
  'Emotional support',
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
    // Validation
    if (!firstName.trim()) {
      Alert.alert('Required Field', 'Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Required Field', 'Please enter your last name.');
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 18) {
      Alert.alert('Invalid Age', 'Please enter a valid age (18 or older).');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Required Field', 'Please enter your city.');
      return;
    }
    if (!provinceState.trim()) {
      Alert.alert('Required Field', 'Please enter your province/state.');
      return;
    }
    if (!country.trim()) {
      Alert.alert('Required Field', 'Please enter your country.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (lookingFor.length === 0) {
      Alert.alert('Required Field', 'Please select at least one option for what you are looking for.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Backend Integration - Submit waitlist application to POST /api/waitlist/apply
      // The backend should validate and store: firstName, lastName, age, city, provinceState, 
      // country, email, phone (optional), lookingFor (1-5 items), additionalInfo (optional)
      await apiPost('/api/waitlist/apply', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: Number(age),
        city: city.trim(),
        provinceState: provinceState.trim(),
        country: country.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        lookingFor,
        additionalInfo: additionalInfo.trim() || undefined,
      });

      router.push('/waitlist/confirmation');
    } catch (error: any) {
      console.log('Application submission error:', error);
      Alert.alert('Error', error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
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
              source={require('@/assets/images/9d78a159-4b83-473c-a4f1-55affbc6fcf0.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Join the Waitlist</Text>
            <Text style={styles.subtitle}>
              Complete your application to join our exclusive community
            </Text>

            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </View>

            {/* Age */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />
            </View>

            {/* City */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter your city"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </View>

            {/* Province/State */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Province/State *</Text>
              <TextInput
                style={styles.input}
                value={provinceState}
                onChangeText={setProvinceState}
                placeholder="Enter your province or state"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </View>

            {/* Country */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </View>

            {/* What are you looking for */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What are you looking for? * (Select up to 5)</Text>
              <Text style={styles.selectedCount}>{lookingFor.length}/5 selected</Text>
              <View style={styles.optionsContainer}>
                {RELATIONSHIP_GOALS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      lookingFor.includes(option) && styles.optionButtonSelected,
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

            {/* Additional Information (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Additional Information (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Tell us more about yourself..."
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
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
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
    padding: 24,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  selectedCount: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionButtonSelected: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  optionText: {
    fontSize: 14,
    color: '#fff',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: '#aaa',
  },
});
