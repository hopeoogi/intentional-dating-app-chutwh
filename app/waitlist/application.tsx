
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'https://erm5magsz6azuge4mtdkxhsmzj7uqr45.app.specular.dev';

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Life partner',
  'Serious dating',
  'Companionship',
  'New friends',
  'Short-term dating',
  'Casual dating',
  'Open to exploring',
  'Figuring it out',
  'Friendship first',
  'Activity partner',
  'Travel companion',
  'Creative collaboration',
  'Networking',
  'Mentorship',
  'Language exchange',
  'Fitness buddy',
  'Foodie friend',
  'Cultural exchange',
  'Open relationship',
];

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter(item => item !== option));
    } else {
      if (lookingFor.length < 5) {
        setLookingFor([...lookingFor, option]);
      } else {
        Alert.alert('Maximum Selection', 'You can select up to 5 options');
      }
    }
  };

  const handleSubmit = async () => {
    console.log('[Application] Starting submission...');
    
    // Validation
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name');
      return;
    }
    
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      Alert.alert('Invalid Age', 'Please enter a valid age (18-100)');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Missing Information', 'Please enter your city');
      return;
    }

    if (!country.trim()) {
      Alert.alert('Missing Information', 'Please enter your country');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (lookingFor.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one relationship goal');
      return;
    }

    setLoading(true);

    try {
      const endpoint = `${BACKEND_URL}/api/waitlist/apply`;
      console.log('[Application] Submitting to:', endpoint);
      console.log('[Application] Backend URL:', BACKEND_URL);
      
      const applicationData = {
        name: name.trim(),
        age: ageNum,
        location: `${city.trim()}, ${country.trim()}`,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        lookingFor: lookingFor.join(', '),
        additionalInfo: additionalInfo.trim() || undefined,
      };

      console.log('[Application] Sending data:', JSON.stringify(applicationData, null, 2));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      console.log('[Application] Response status:', response.status);
      console.log('[Application] Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

      // Try to get response text first
      const responseText = await response.text();
      console.log('[Application] Response text:', responseText);

      if (!response.ok) {
        console.error('[Application] Error response:', responseText);
        
        // Try to parse as JSON for better error message
        let errorMessage = `Application failed (${response.status})`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.log('[Application] Could not parse error as JSON');
          if (responseText) {
            errorMessage = responseText;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('[Application] Success:', result);
      } catch (e) {
        console.log('[Application] Response is not JSON, but request succeeded');
        result = { success: true };
      }

      // Navigate to confirmation
      console.log('[Application] Navigating to confirmation...');
      router.replace('/waitlist/confirmation');
    } catch (error) {
      console.error('[Application] Submission error:', error);
      
      let errorMessage = 'Unable to submit application. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert(
        'Submission Failed',
        errorMessage,
        [
          { 
            text: 'Retry', 
            onPress: () => handleSubmit() 
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/c16dda65-bb0d-4cb6-ba78-d87103621eb0.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Join Intentional</Text>
            <Text style={styles.subtitle}>
              Apply to join our community of intentional daters
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Toronto"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Country *</Text>
                <TextInput
                  style={styles.input}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Canada"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>What are you looking for? * (Select up to 5)</Text>
              <Text style={styles.helperText}>{lookingFor.length}/5 selected</Text>
              <View style={styles.optionsGrid}>
                {RELATIONSHIP_GOALS.map((goal, index) => (
                  <TouchableOpacity
                    key={`${goal}-${index}`}
                    style={[
                      styles.optionButton,
                      lookingFor.includes(goal) && styles.optionButtonSelected,
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tell us more (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Anything else you'd like us to know..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#000', '#333']}
              style={styles.gradient}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.loadingText}>Submitting...</Text>
                </View>
              ) : (
                <Text style={styles.submitText}>Submit Application</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
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
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  optionButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  gradient: {
    padding: 18,
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
