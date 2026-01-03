
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
import { apiPost, isBackendConfigured, BACKEND_URL } from '@/utils/api';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Life partner',
  'Serious dating',
  'Open to possibilities',
];

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
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

  const toggleLookingFor = (option: string) => {
    setLookingFor(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      Alert.alert('Error', 'Please enter a valid age (18-100)');
      return;
    }

    if (!city.trim() || !provinceState.trim() || !country.trim()) {
      Alert.alert('Error', 'Please enter your complete location');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (lookingFor.length === 0) {
      Alert.alert('Error', 'Please select at least one relationship goal');
      return;
    }

    if (!isBackendConfigured()) {
      Alert.alert('Error', 'Backend not configured. Please contact support.');
      console.error('[Application] Backend URL:', BACKEND_URL);
      return;
    }

    setLoading(true);

    try {
      const payload = {
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
      };

      console.log('[Application] Submitting to:', `${BACKEND_URL}/api/waitlist/apply`);
      console.log('[Application] Payload:', payload);

      const response = await apiPost('/api/waitlist/apply', payload);
      
      console.log('[Application] Success:', response);
      
      // Navigate to confirmation screen
      router.push('/waitlist/confirmation');
    } catch (error: any) {
      console.error('[Application] Submit error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Unable to submit application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#1a1a1a', '#0a0a0a']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Join the Waitlist</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself to get early access
            </Text>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>First Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Last Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>

              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="25"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />

              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="New York"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Province/State *</Text>
              <TextInput
                style={styles.input}
                value={provinceState}
                onChangeText={setProvinceState}
                placeholder="NY"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="United States"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
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

              <Text style={styles.label}>Additional Info (Optional)</Text>
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
    padding: 24,
    paddingBottom: 40,
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
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  optionSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  optionText: {
    fontSize: 14,
    color: '#999',
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
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});
