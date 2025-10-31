
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  // Modern gradient-inspired color palette
  background: '#0F172A', // Deep navy blue
  backgroundLight: '#1E293B', // Lighter navy
  text: '#F8FAFC', // Off-white
  textSecondary: '#94A3B8', // Muted blue-gray
  primary: '#F59E0B', // Warm amber
  primaryLight: '#FCD34D', // Light amber
  primaryDark: '#D97706', // Dark amber
  secondary: '#8B5CF6', // Purple
  secondaryLight: '#A78BFA', // Light purple
  accent: '#334155', // Slate
  accentLight: '#475569', // Light slate
  card: '#1E293B', // Card background
  cardLight: '#334155', // Lighter card
  highlight: '#FEF3C7', // Light yellow
  success: '#10B981', // Green
  danger: '#EF4444', // Red
  warning: '#F59E0B', // Amber
  
  // Gradient colors
  gradientStart: '#F59E0B',
  gradientEnd: '#D97706',
  gradientPurpleStart: '#8B5CF6',
  gradientPurpleEnd: '#6D28D9',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.accent,
    alignSelf: 'center',
    width: '100%',
  },
});

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
});
