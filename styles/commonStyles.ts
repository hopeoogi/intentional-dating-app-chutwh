
import { StyleSheet } from 'react-native';

// Raya-inspired dark elegance color palette
export const colors = {
  background: '#0A0A0A',        // Deep black
  card: '#1C1C1E',              // Charcoal
  text: '#FFFFFF',              // White
  textSecondary: '#8E8E93',     // Muted gray
  primary: '#D4AF37',           // Gold accent
  secondary: '#2C2C2E',         // Dark gray
  accent: '#C9A961',            // Soft gold
  highlight: '#FFD700',         // Bright gold for badges
  error: '#FF3B30',             // Red for errors
  success: '#34C759',           // Green for success
  border: '#38383A',            // Subtle border
};

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
