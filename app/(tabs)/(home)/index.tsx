
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface Badge {
  id: string;
  label: string;
  color: string;
}

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  photos: string[];
  badges: Badge[];
  bio?: string;
}

export default function MatchesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMessagePrompt, setShowMessagePrompt] = useState(false);

  useEffect(() => {
    if (user) {
      loadDailyMatches();
    }
  }, [user]);

  // Reload matches when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user && profiles.length === 0) {
        loadDailyMatches();
      }
    }, [user, profiles.length])
  );

  const loadDailyMatches = async () => {
    try {
      setLoading(true);
      const { authenticatedGet } = await import('@/utils/api');
      
      const data = await authenticatedGet<{ matches: Profile[] }>('/api/matches/daily');
      console.log('[Matches] Loaded daily matches:', data);
      setProfiles(data.matches || []);
    } catch (error: any) {
      console.error('[Matches] Failed to load matches:', error);
      
      // Check if error is about incomplete profile
      if (error.message?.includes('profile') || error.message?.includes('403')) {
        Alert.alert(
          'Complete Your Profile',
          'Please complete your profile to start seeing matches.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Complete Profile', 
              onPress: () => router.push('/auth/profile-setup')
            }
          ]
        );
      } else if (!error.message?.includes('401')) {
        // Show error alert if it's not a 401 (auth error)
        Alert.alert(
          'Unable to Load Matches',
          'Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      }
      
      // Show empty state on error
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePass = async () => {
    const currentProfile = profiles[currentIndex];
    
    try {
      const { authenticatedPost } = await import('@/utils/api');
      
      // Record the view action (pass)
      await authenticatedPost(`/api/matches/${currentProfile.id}/view`, {
        action: 'pass'
      });
      console.log('[Matches] Recorded pass for:', currentProfile.id);
    } catch (error) {
      console.error('[Matches] Failed to record pass:', error);
    }
    
    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more profiles
      setProfiles([]);
    }
  };

  const handleMessage = () => {
    setShowMessagePrompt(true);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Welcome to Intentional Dating</Text>
          <Text style={styles.authText}>Sign in to start connecting</Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push('/auth/sign-in')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <IconSymbol
            ios_icon_name="heart.fill"
            android_material_icon_name="favorite"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>No More Matches Today</Text>
          <Text style={styles.emptyText}>
            Check back tomorrow for new connections
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentProfile = profiles[currentIndex];

  if (showMessagePrompt) {
    return (
      <MessagePrompt
        profile={currentProfile}
        onClose={() => setShowMessagePrompt(false)}
        onSend={() => {
          setShowMessagePrompt(false);
          if (currentIndex < profiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setProfiles([]);
          }
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: currentProfile.photos[0] }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
        >
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {currentProfile.name}, {currentProfile.age}
            </Text>
            <View style={styles.locationContainer}>
              <IconSymbol
                ios_icon_name="location.fill"
                android_material_icon_name="location-on"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.location}>{currentProfile.location}</Text>
            </View>
            
            <View style={styles.badgesContainer}>
              {currentProfile.badges.map((badge) => (
                <View
                  key={badge.id}
                  style={[styles.badge, { backgroundColor: badge.color }]}
                >
                  <Text style={styles.badgeText}>{badge.label}</Text>
                </View>
              ))}
            </View>
            
            {currentProfile.bio && (
              <ScrollView style={styles.bioContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.bioText}>{currentProfile.bio}</Text>
              </ScrollView>
            )}
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.passButton}
          onPress={handlePass}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={32}
            color={colors.text}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleMessage}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="message.fill"
            android_material_icon_name="chat"
            size={28}
            color={colors.background}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.matchCounter}>
        <Text style={styles.matchCounterText}>
          {currentIndex + 1} / {profiles.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

function MessagePrompt({
  profile,
  onClose,
  onSend,
}: {
  profile: Profile;
  onClose: () => void;
  onSend: () => void;
}) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (message.trim().length < 36) {
      setError('Your message must be at least 36 characters to show genuine interest');
      return;
    }

    try {
      const { authenticatedPost } = await import('@/utils/api');
      
      await authenticatedPost('/api/conversations/start', {
        matchId: profile.id,
        message: message.trim()
      });
      
      console.log('[Matches] Started conversation with:', profile.id);
      onSend();
    } catch (error) {
      console.error('[Matches] Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.promptContainer}>
        <View style={styles.promptHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.promptTitle}>Start a Conversation</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView contentContainerStyle={styles.promptContent}>
          <Image
            source={{ uri: profile.photos[0] }}
            style={styles.promptAvatar}
          />
          <Text style={styles.promptName}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.promptInstruction}>
            Write a thoughtful message (minimum 36 characters)
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message here..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {message.length} / 36 minimum
            </Text>
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              message.length < 36 && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={message.length < 36}
            activeOpacity={0.7}
          >
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  profileCard: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  profileInfo: {
    padding: 24,
    paddingBottom: 120,
  },
  profileName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  bioContainer: {
    maxHeight: 100,
  },
  bioText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  messageButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchCounter: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 20,
    alignSelf: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  matchCounterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  authText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  promptContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  promptContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  promptAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  promptName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  promptInstruction: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    minHeight: 150,
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    minHeight: 100,
  },
  charCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
