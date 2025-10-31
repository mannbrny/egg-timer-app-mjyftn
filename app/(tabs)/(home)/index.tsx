
import React from "react";
import { Stack, Link } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Egg Timer App",
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroEmoji}>🥚</Text>
            <Text style={styles.heroTitle}>Perfect Egg Timer</Text>
            <Text style={styles.heroSubtitle}>
              Cook your eggs to perfection every time
            </Text>
          </View>

          <Link href="/(tabs)/(home)/eggTimer" asChild>
            <Pressable style={styles.mainCard}>
              <GlassView 
                style={[
                  styles.cardContent,
                  Platform.OS !== 'ios' && { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                ]} 
                glassEffectStyle="regular"
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.cardEmoji}>⏱️</Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Start Cooking</Text>
                  <Text style={styles.cardDescription}>
                    Calculate the perfect cooking time for your eggs
                  </Text>
                </View>
                <IconSymbol 
                  name="chevron.right" 
                  color={colors.primary} 
                  size={24} 
                />
              </GlassView>
            </Pressable>
          </Link>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How It Works</Text>
            
            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Choose Egg Size</Text>
                <Text style={styles.stepDescription}>
                  Select from small, medium, or large eggs
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Select Doneness</Text>
                <Text style={styles.stepDescription}>
                  Pick soft, medium, or hard boiled
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Start Timer</Text>
                <Text style={styles.stepDescription}>
                  Get notified when your egg is ready
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.featuresSection}>
            <View style={styles.featureCard}>
              <Text style={styles.featureEmoji}>🎯</Text>
              <Text style={styles.featureTitle}>Precise Timing</Text>
              <Text style={styles.featureText}>
                Accurate cooking times for perfect results
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureEmoji}>🔔</Text>
              <Text style={styles.featureTitle}>Notifications</Text>
              <Text style={styles.featureText}>
                Get alerted when your egg is done
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureEmoji}>📱</Text>
              <Text style={styles.featureTitle}>Easy to Use</Text>
              <Text style={styles.featureText}>
                Simple interface for quick cooking
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  mainCard: {
    marginBottom: 30,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  iconContainer: {
    marginRight: 16,
  },
  cardEmoji: {
    fontSize: 48,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  featuresSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  featureEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
