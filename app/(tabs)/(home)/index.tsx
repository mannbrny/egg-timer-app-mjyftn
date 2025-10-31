
import React from "react";
import { Stack, Link } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
            headerShadowVisible: false,
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
          <Animated.View 
            entering={FadeInUp.duration(600).delay(100)}
            style={styles.heroSection}
          >
            <View style={styles.heroEmojiContainer}>
              <Text style={styles.heroEmoji}>🥚</Text>
              <View style={styles.heroGlow} />
            </View>
            <Text style={styles.heroTitle}>Perfect Egg Timer</Text>
            <Text style={styles.heroSubtitle}>
              Cook your eggs to perfection every time with precision timing
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <Link href="/(tabs)/(home)/eggTimer" asChild>
              <AnimatedPressable style={styles.mainCard}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.cardEmoji}>⏱️</Text>
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>Start Cooking</Text>
                      <Text style={styles.cardDescription}>
                        Calculate the perfect cooking time
                      </Text>
                    </View>
                    <IconSymbol 
                      name="chevron.right" 
                      color={colors.text} 
                      size={28} 
                    />
                  </View>
                </LinearGradient>
              </AnimatedPressable>
            </Link>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.duration(600).delay(300)}
            style={styles.infoSection}
          >
            <Text style={styles.infoTitle}>How It Works</Text>
            
            <View style={styles.stepCard}>
              <LinearGradient
                colors={[colors.card, colors.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.stepGradient}
              >
                <View style={styles.stepNumber}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepNumberGradient}
                  >
                    <Text style={styles.stepNumberText}>1</Text>
                  </LinearGradient>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Choose Egg Size</Text>
                  <Text style={styles.stepDescription}>
                    Select from small, medium, or large eggs
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.stepCard}>
              <LinearGradient
                colors={[colors.card, colors.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.stepGradient}
              >
                <View style={styles.stepNumber}>
                  <LinearGradient
                    colors={[colors.secondary, colors.gradientPurpleEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepNumberGradient}
                  >
                    <Text style={styles.stepNumberText}>2</Text>
                  </LinearGradient>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Select Doneness</Text>
                  <Text style={styles.stepDescription}>
                    Pick soft, medium, or hard boiled
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.stepCard}>
              <LinearGradient
                colors={[colors.card, colors.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.stepGradient}
              >
                <View style={styles.stepNumber}>
                  <LinearGradient
                    colors={[colors.success, '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepNumberGradient}
                  >
                    <Text style={styles.stepNumberText}>3</Text>
                  </LinearGradient>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Start Timer</Text>
                  <Text style={styles.stepDescription}>
                    Get notified when your egg is ready
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.duration(600).delay(400)}
            style={styles.featuresSection}
          >
            <View style={styles.featureCard}>
              <LinearGradient
                colors={[colors.card, colors.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureEmoji}>🎯</Text>
                </View>
                <Text style={styles.featureTitle}>Precise Timing</Text>
                <Text style={styles.featureText}>
                  Accurate cooking times for perfect results
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[colors.card, colors.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureEmoji}>🔔</Text>
                </View>
                <Text style={styles.featureTitle}>Notifications</Text>
                <Text style={styles.featureText}>
                  Get alerted when your egg is done
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[colors.card, colors.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureEmoji}>📱</Text>
                </View>
                <Text style={styles.featureTitle}>Easy to Use</Text>
                <Text style={styles.featureText}>
                  Simple interface for quick cooking
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[colors.card, colors.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureEmoji}>✨</Text>
                </View>
                <Text style={styles.featureTitle}>Beautiful UI</Text>
                <Text style={styles.featureText}>
                  Modern design with smooth animations
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>
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
  heroEmojiContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 100,
  },
  heroGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 120,
    height: 120,
    backgroundColor: colors.primary,
    borderRadius: 60,
    opacity: 0.2,
    transform: [{ translateX: -60 }, { translateY: -60 }],
    boxShadow: '0px 0px 60px rgba(245, 158, 11, 0.6)',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  mainCard: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(245, 158, 11, 0.4)',
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginRight: 16,
  },
  cardEmoji: {
    fontSize: 52,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.9,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  stepCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  stepGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: colors.accentLight,
    borderRadius: 16,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
  },
  stepNumberGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  featuresSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  featureGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentLight,
    borderRadius: 16,
    minHeight: 160,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.accentLight,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  featureText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
