
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
import { apiPost } from '@/utils/api';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Life partner',
  'Marriage',
  'Dating with intention',
  'Serious relationship',
  'Companionship',
  'Deep connection',
  'Emotional intimacy',
  'Building a future together',
  'Finding my person',
  'Committed partnership',
  'Soulmate',
  'Meaningful relationship',
  'Exclusive dating',
  'Settling down',
  'Starting a family',
  'Life-long love',
  'Authentic connection',
  'Slow dating',
  'Intentional partnership',
  'True love',
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
        Alert.alert('Limit Reached', 'You can select up to 5 options.');
      }
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !age.trim() ||
      !city.trim() ||
      !provinceState.trim() ||
      !country.trim() ||
      !email.trim() ||
      lookingFor.length === 0
    ) {
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

    try {
      const response = await apiPost('/api/waitlist/apply', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: ageNum,
        city: city.trim(),
        provinceState: provinceState.trim(),
        country: country.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        lookingFor,
        additionalInfo: additionalInfo.trim() || undefined,
      });

      console.log('✅ Application submitted successfully:', response);
      router.push('/waitlist/confirmation');
    } catch (error: any) {
      console.error('❌ Application submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Unable to submit your application. Please try again.'
      );
    } finally {
      setLoading(false);
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
          >
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Join the Waitlist</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself to get started
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>
                First Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>
                Last Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />

              <Text style={styles.label}>
                City <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter your city"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>
                Province/State <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={provinceState}
                onChangeText={setProvinceState}
                placeholder="Enter your province or state"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>
                Country <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>
                What are you looking for?{' '}
                <Text style={styles.required}>* (select up to 5)</Text>
              </Text>
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

              <Text style={styles.label}>Additional Information (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Tell us more about yourself..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />

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

              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backText}>← Back</Text>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#FF6B6B',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
