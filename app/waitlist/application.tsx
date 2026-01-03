
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { apiPost, isBackendConfigured } from '@/utils/api';

const RELATIONSHIP_GOALS = ['Long-term', 'Marriage', 'Dating', 'Friendship'];

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', age: '', city: '', provinceState: '',
    country: '', email: '', phone: '', lookingFor: [] as string[], additionalInfo: '',
  });

  const toggleLookingFor = (option: string) => {
    console.log('[Waitlist] Toggling option:', option);
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(option)
        ? prev.lookingFor.filter(o => o !== option)
        : [...prev.lookingFor, option],
    }));
  };

  const handleSubmit = async () => {
    console.log('[Waitlist Application] ========== SUBMIT STARTED ==========');
    console.log('[Waitlist Application] Button pressed at:', new Date().toISOString());
    console.log('[Waitlist Application] Form data:', JSON.stringify(formData, null, 2));
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.age) {
      console.log('[Waitlist Application] Validation failed - missing required fields');
      Alert.alert('Missing Fields', 'Please fill in all required fields (First Name, Last Name, Email, Age)');
      return;
    }

    if (formData.lookingFor.length === 0) {
      console.log('[Waitlist Application] Validation failed - no relationship goals selected');
      Alert.alert('Missing Selection', 'Please select what you\'re looking for');
      return;
    }

    console.log('[Waitlist Application] Validation passed ✓');
    setLoading(true);

    try {
      const backendConfigured = isBackendConfigured();
      console.log('[Waitlist Application] Backend configured:', backendConfigured);

      if (!backendConfigured) {
        console.log('[Waitlist Application] Backend not configured - navigating to confirmation anyway');
        console.log('[Waitlist Application] Calling router.replace("/waitlist/confirmation")');
        
        // Small delay to ensure state updates
        await new Promise(resolve => setTimeout(resolve, 500));
        
        router.replace('/waitlist/confirmation');
        console.log('[Waitlist Application] Navigation command executed');
        return;
      }

      // Backend is configured, try to submit
      console.log('[Waitlist Application] Submitting to backend API...');
      const response = await apiPost('/api/waitlist/apply', {
        ...formData,
        age: parseInt(formData.age),
      });

      console.log('[Waitlist Application] API response received:', response);
      console.log('[Waitlist Application] Navigating to confirmation screen');
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.replace('/waitlist/confirmation');
      console.log('[Waitlist Application] Navigation command executed');
      
    } catch (error) {
      console.error('[Waitlist Application] ========== ERROR OCCURRED ==========');
      console.error('[Waitlist Application] Error details:', error);
      console.error('[Waitlist Application] Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('[Waitlist Application] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      Alert.alert(
        'Submission Error', 
        'Failed to submit application. Please try again.\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      console.log('[Waitlist Application] Setting loading to false');
      setLoading(false);
      console.log('[Waitlist Application] ========== SUBMIT COMPLETED ==========');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Join the Waitlist</Text>
          <Text style={styles.subtitle}>Fill out the application below</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="First Name *" 
            placeholderTextColor="#666"
            value={formData.firstName} 
            onChangeText={text => setFormData({...formData, firstName: text})}
            autoCapitalize="words"
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Last Name *" 
            placeholderTextColor="#666"
            value={formData.lastName} 
            onChangeText={text => setFormData({...formData, lastName: text})}
            autoCapitalize="words"
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Age *" 
            placeholderTextColor="#666" 
            keyboardType="numeric"
            value={formData.age} 
            onChangeText={text => setFormData({...formData, age: text.replace(/[^0-9]/g, '')})}
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Email *" 
            placeholderTextColor="#666" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email} 
            onChangeText={text => setFormData({...formData, email: text.trim()})}
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Phone" 
            placeholderTextColor="#666" 
            keyboardType="phone-pad"
            value={formData.phone} 
            onChangeText={text => setFormData({...formData, phone: text})}
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="City" 
            placeholderTextColor="#666"
            value={formData.city} 
            onChangeText={text => setFormData({...formData, city: text})}
            autoCapitalize="words"
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Province/State" 
            placeholderTextColor="#666"
            value={formData.provinceState} 
            onChangeText={text => setFormData({...formData, provinceState: text})}
            autoCapitalize="words"
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Country" 
            placeholderTextColor="#666"
            value={formData.country} 
            onChangeText={text => setFormData({...formData, country: text})}
            autoCapitalize="words"
          />

          <Text style={styles.label}>What are you looking for? *</Text>
          <View style={styles.optionsContainer}>
            {RELATIONSHIP_GOALS.map((goal, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.option, formData.lookingFor.includes(goal) && styles.optionSelected]}
                onPress={() => toggleLookingFor(goal)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, formData.lookingFor.includes(goal) && styles.optionTextSelected]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Additional Info (Optional)" 
            placeholderTextColor="#666"
            multiline 
            numberOfLines={4} 
            value={formData.additionalInfo}
            onChangeText={text => setFormData({...formData, additionalInfo: text})}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Application</Text>
            )}
          </TouchableOpacity>

          {/* Debug info - remove in production */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Backend: {isBackendConfigured() ? '✓ Configured' : '✗ Not configured'}
            </Text>
            <Text style={styles.debugText}>
              Selected: {formData.lookingFor.join(', ') || 'None'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  scrollContent: { 
    padding: 24,
    paddingBottom: 40,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 8 
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 32,
  },
  input: { 
    backgroundColor: '#1a1a1a', 
    color: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  textArea: { 
    height: 120, 
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  label: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12,
    marginTop: 8,
  },
  optionsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 24,
    gap: 8,
  },
  option: { 
    backgroundColor: '#1a1a1a', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  optionSelected: { 
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: { 
    color: '#999', 
    fontSize: 15,
    fontWeight: '500',
  },
  optionTextSelected: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  submitButton: { 
    backgroundColor: colors.primary, 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '600' 
  },
  debugContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  debugText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
