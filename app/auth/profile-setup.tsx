
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const AVAILABLE_BADGES = [
  { id: 'professional', label: 'PROFESSIONAL', color: '#4A90E2' },
  { id: 'traveller', label: 'TRAVELLER', color: '#50C878' },
  { id: 'student', label: 'STUDENT', color: '#9B59B6' },
  { id: 'artist', label: 'ARTIST', color: '#E74C3C' },
  { id: 'investor', label: 'INVESTOR', color: '#F39C12' },
  { id: 'nurse', label: 'NURSE', color: '#3498DB' },
  { id: 'influencer', label: 'INFLUENCER', color: '#E91E63' },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert('Maximum Photos', 'You can upload up to 6 photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const toggleBadge = (badgeId: string) => {
    if (selectedBadges.includes(badgeId)) {
      setSelectedBadges(selectedBadges.filter((id) => id !== badgeId));
    } else if (selectedBadges.length < 5) {
      setSelectedBadges([...selectedBadges, badgeId]);
    } else {
      Alert.alert('Maximum Badges', 'You can select up to 5 badges');
    }
  };

  const handleComplete = async () => {
    if (!age || !location || photos.length === 0) {
      Alert.alert('Incomplete Profile', 'Please add your age, location, and at least one photo');
      return;
    }

    try {
      setLoading(true);
      const { authenticatedPost, BACKEND_URL } = await import('@/utils/api');
      const { getBearerToken } = await import('@/utils/api');
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add photos
      photos.forEach((photo, index) => {
        const photoFile: any = {
          uri: photo,
          type: 'image/jpeg',
          name: `photo${index}.jpg`,
        };
        formData.append('photos', photoFile);
      });
      
      // Add other profile data
      formData.append('age', age);
      formData.append('location', location);
      formData.append('bio', bio);
      formData.append('badges', JSON.stringify(selectedBadges));
      
      // Get bearer token for authentication
      const token = await getBearerToken();
      
      // Use fetch directly for FormData (multipart/form-data)
      const response = await fetch(`${BACKEND_URL}/api/profile/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let browser set it with boundary
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Profile setup failed: ${response.status}`);
      }
      
      console.log('[Profile] Profile created successfully');
      router.replace('/(tabs)/(home)');
    } catch (error) {
      console.error('[Profile] Failed to setup profile:', error);
      Alert.alert('Error', 'Failed to setup profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: 'Complete Your Profile',
          headerLeft: () => null,
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.sectionSubtitle}>Add at least one photo (max 6)</Text>
          
          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => removePhoto(index)}
                >
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={24}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            ))}
            
            {photos.length < 6 && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add-circle"
                  size={48}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.sectionTitle}>Basic Info</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor={colors.textSecondary}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={2}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Location (City, State)"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
          
          <Text style={styles.sectionTitle}>About You</Text>
          
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Write a brief bio..."
            placeholderTextColor={colors.textSecondary}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={300}
          />
          <Text style={styles.charCount}>{bio.length} / 300</Text>
          
          <Text style={styles.sectionTitle}>Select Badges (up to 5)</Text>
          
          <View style={styles.badgesContainer}>
            {AVAILABLE_BADGES.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeOption,
                  selectedBadges.includes(badge.id) && {
                    backgroundColor: badge.color,
                  },
                ]}
                onPress={() => toggleBadge(badge.id)}
              >
                <Text
                  style={[
                    styles.badgeOptionText,
                    selectedBadges.includes(badge.id) && styles.badgeOptionTextSelected,
                  ]}
                >
                  {badge.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.completeButton, loading && styles.completeButtonDisabled]}
            onPress={handleComplete}
            disabled={loading}
          >
            <Text style={styles.completeButtonText}>
              {loading ? 'Setting Up...' : 'Complete Profile'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 3 / 4,
    marginRight: '3.5%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bioInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  badgeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  badgeOptionTextSelected: {
    color: colors.text,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
