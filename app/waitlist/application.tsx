
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
  'Dating',
  'Friendship',
  'Networking',
  'Casual dating',
  'Life partner',
  'Companionship',
  'Serious relationship',
  'Open to possibilities',
  'Meaningful connection',
  'Emotional intimacy',
  'Shared values',
  'Growth together',
  'Adventure partner',
  'Intellectual connection',
  'Spiritual connection',
  'Family-oriented',
  'Career-focused dating',
  'Creative partnership',
  'Travel companion',
];

const MAX_SELECTIONS = 5;

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
      if (lookingFor.length < MAX_SELECTIONS) {
        setLookingFor([...lookingFor, option]);
      } else {
        Alert.alert(
          'Maximum Selections Reached',
          `You can select up to ${MAX_SELECTIONS} options.`
        );
      }
    }
  };

  const handleSubmit = async () => {
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
      Alert.alert('Error', 'Please enter your location (City, Province/State)');
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

    setLoading(true);

    try {
      await apiPost('/api/waitlist/apply', {
        name: name.trim(),
        age: Number(age),
        location: location.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        lookingFor,
        additionalInfo: additionalInfo.trim() || undefined,
      });

      Alert.alert(
        'Application Submitted!',
        'Thank you for joining our waitlist. We'll be in touch soon!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/waitlist/confirmation'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Submission Error',
        error.message || 'Failed to submit application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/77b22b19-c746-4e98-8d29-016843ab4dd1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Join the Waitlist</Text>
            <Text style={styles.subtitle}>
              Help us build something special for you
            </Text>

            {/* Form Fields */}
            <View style={styles.form}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
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
                placeholder="City, Province/State"
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
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>
                What are you looking for? * (Select up to {MAX_SELECTIONS})
              </Text>
              <Text style={styles.selectionCount}>
                {lookingFor.length} / {MAX_SELECTIONS} selected
              </Text>
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
                style={[styles.input, styles.textArea]}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Share anything else you'd like us to know..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#1a1a1a" />
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 32,
    textAlign: 'center',
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  selectionCount: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
