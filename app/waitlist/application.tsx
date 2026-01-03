
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
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

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:3000';

const RELATIONSHIP_GOALS = [
  'Long-term partner', 'Life partner', 'Long-term, open to short', 'Short-term, open to long',
  'Short-term fun', 'New friends', 'Still figuring it out', 'Marriage', 'Casual dating',
  'Serious relationship', 'Companionship', 'Travel partner', 'Activity partner',
  'Networking', 'Mentorship', 'Creative collaboration', 'Fitness buddy', 'Foodie friend',
  'Concert/event buddy', 'Language exchange', 'Open to anything'
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  optionButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    color: '#999',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 32,
    marginBottom: 40,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#333',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default function ApplicationScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter(item => item !== option));
    } else if (lookingFor.length < 5) {
      setLookingFor([...lookingFor, option]);
    } else {
      Alert.alert('Maximum Selection', 'You can select up to 5 options');
    }
  };

  const handleSubmit = async () => {
    if (!name || !age || !location || !email || lookingFor.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
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
          name,
          age: parseInt(age),
          location,
          email,
          phone,
          lookingFor: lookingFor.join(', '),
          additionalInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      router.replace('/waitlist/confirmation');
    } catch (error) {
      console.error('Application error:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/ab20ad44-8729-4a6f-86c6-a7356bbf7036.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Join Intentional</Text>
            <Text style={styles.subtitle}>Apply to join the community</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
              placeholderTextColor="#666"
            />

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

            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>What are you looking for? * (Select up to 5)</Text>
            <Text style={styles.helperText}>Selected: {lookingFor.length}/5</Text>
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

            <Text style={styles.label}>Tell us more (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholder="Anything else you'd like us to know?"
              placeholderTextColor="#666"
              multiline
            />

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
