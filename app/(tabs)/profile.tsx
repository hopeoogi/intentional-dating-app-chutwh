
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  bio?: string;
  photos?: string[];
  badges?: Array<{ id: string; label: string; color: string }>;
  image?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { authenticatedGet } = await import('@/utils/api');
      
      const data = await authenticatedGet<UserProfile>('/api/profile/me');
      console.log('[Profile] Loaded profile:', data);
      setProfile(data);
    } catch (error: any) {
      console.error('[Profile] Failed to load profile:', error);
      
      // If profile doesn't exist (404), show option to complete setup
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        Alert.alert(
          'Profile Not Found',
          'Would you like to complete your profile setup?',
          [
            { text: 'Later', style: 'cancel' },
            { 
              text: 'Complete Profile', 
              onPress: () => router.push('/auth/profile-setup')
            }
          ]
        );
      }
      
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth/sign-in');
            } catch (error) {
              console.error('Sign out failed:', error);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Profile</Text>
          <Text style={styles.authText}>Sign in to view your profile</Text>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.profileSection}>
          {(profile?.photos && profile.photos.length > 0) || profile?.image || user.image ? (
            <Image 
              source={{ uri: profile?.photos?.[0] || profile?.image || user.image }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <IconSymbol
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={48}
                color={colors.textSecondary}
              />
            </View>
          )}
          
          <Text style={styles.name}>
            {profile?.name || user.name || 'User'}
            {profile?.age ? `, ${profile.age}` : ''}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          {profile?.location && (
            <Text style={styles.location}>{profile.location}</Text>
          )}
        </View>
        
        <View style={styles.menuSection}>
          {!profile && (
            <TouchableOpacity 
              style={[styles.menuItem, styles.completeProfileItem]}
              onPress={() => router.push('/auth/profile-setup')}
            >
              <IconSymbol
                ios_icon_name="exclamationmark.circle.fill"
                android_material_icon_name="error"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.menuItemText, styles.completeProfileText]}>
                Complete Your Profile
              </Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="arrow-forward"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="pencil"
              android_material_icon_name="edit"
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="photo"
              android_material_icon_name="photo"
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>Manage Photos</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="gear"
              android_material_icon_name="settings"
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>Settings</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="shield.fill"
              android_material_icon_name="security"
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>Privacy & Safety</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <IconSymbol
            ios_icon_name="arrow.right.square.fill"
            android_material_icon_name="logout"
            size={24}
            color={colors.error}
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  menuSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  completeProfileItem: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  completeProfileText: {
    color: colors.primary,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: colors.error,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 12,
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
});
