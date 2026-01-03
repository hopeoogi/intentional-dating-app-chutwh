
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function Index() {
  const { user, loading } = useAuth();

  console.log('[Index] Auth state:', { user: user?.id, loading });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If user is authenticated, redirect to main app
  if (user) {
    console.log('[Index] User authenticated, redirecting to /(tabs)/(home)');
    return <Redirect href="/(tabs)/(home)" />;
  }

  // If not authenticated, redirect to waitlist welcome
  console.log('[Index] User not authenticated, redirecting to /waitlist/welcome');
  return <Redirect href="/waitlist/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
