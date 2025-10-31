
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

type EggSize = 'small' | 'medium' | 'large';
type Doneness = 'soft' | 'medium' | 'hard';

interface CookingTime {
  soft: number;
  medium: number;
  hard: number;
}

const COOKING_TIMES: Record<EggSize, CookingTime> = {
  small: { soft: 180, medium: 240, hard: 300 }, // 3, 4, 5 minutes
  medium: { soft: 240, medium: 300, hard: 360 }, // 4, 5, 6 minutes
  large: { soft: 300, medium: 360, hard: 420 }, // 5, 6, 7 minutes
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EggTimerScreen() {
  const [eggSize, setEggSize] = useState<EggSize>('medium');
  const [doneness, setDoneness] = useState<Doneness>('medium');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Animation values
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [timeRemaining, isRunning]);

  useEffect(() => {
    if (totalTime > 0) {
      const progressValue = ((totalTime - timeRemaining) / totalTime);
      progress.value = withTiming(progressValue, {
        duration: 1000,
        easing: Easing.linear,
      });
    }
  }, [timeRemaining, totalTime]);

  const handleTimerComplete = async () => {
    console.log('Timer completed!');
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Pulse animation
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });

    // Haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Play alarm sound
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Error playing sound:', error);
    }

    Alert.alert(
      '🥚 Egg is Ready!',
      `Your ${doneness} boiled ${eggSize} egg is done!`,
      [{ text: 'OK', onPress: () => console.log('Alert dismissed') }]
    );
  };

  const startTimer = async () => {
    console.log('Starting timer...');
    const cookingTime = COOKING_TIMES[eggSize][doneness];
    setTotalTime(cookingTime);
    setTimeRemaining(cookingTime);
    setIsRunning(true);
    progress.value = 0;

    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = async () => {
    console.log('Stopping timer...');
    setIsRunning(false);
    setTimeRemaining(0);
    setTotalTime(0);
    progress.value = withTiming(0, { duration: 300 });
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const timerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      progress.value,
      [0, 1],
      [0, 360]
    );
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const renderSizeButton = (size: EggSize, label: string, icon: string) => (
    <Pressable
      style={[
        styles.optionButton,
        eggSize === size && styles.optionButtonSelected,
      ]}
      onPress={() => {
        console.log('Selected egg size:', size);
        setEggSize(size);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      disabled={isRunning}
    >
      {eggSize === size ? (
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.optionIcon}>{icon}</Text>
          <Text style={[styles.optionButtonText, styles.optionButtonTextSelected]}>
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <>
          <Text style={styles.optionIcon}>{icon}</Text>
          <Text style={styles.optionButtonText}>{label}</Text>
        </>
      )}
    </Pressable>
  );

  const renderDonenessButton = (done: Doneness, label: string, emoji: string) => (
    <Pressable
      style={[
        styles.optionButton,
        doneness === done && styles.optionButtonSelected,
      ]}
      onPress={() => {
        console.log('Selected doneness:', done);
        setDoneness(done);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      disabled={isRunning}
    >
      {doneness === done ? (
        <LinearGradient
          colors={[colors.secondary, colors.gradientPurpleEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.emojiText}>{emoji}</Text>
          <Text style={[styles.optionButtonText, styles.optionButtonTextSelected]}>
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <>
          <Text style={styles.emojiText}>{emoji}</Text>
          <Text style={styles.optionButtonText}>{label}</Text>
        </>
      )}
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Egg Timer',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🥚 Perfect Egg Timer</Text>
          <Text style={styles.subtitle}>
            Select your egg size and desired doneness
          </Text>
        </View>

        {/* Timer Display with Circular Progress */}
        <Animated.View style={[styles.timerContainer, timerAnimatedStyle]}>
          <View style={styles.timerCircleOuter}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>
                {isRunning || timeRemaining > 0
                  ? formatTime(timeRemaining)
                  : formatTime(COOKING_TIMES[eggSize][doneness])}
              </Text>
              <Text style={styles.timerLabel}>
                {isRunning ? 'Cooking...' : 'Ready to Start'}
              </Text>
            </View>
            {/* Circular progress indicator */}
            {isRunning && (
              <View style={styles.progressRing}>
                <View style={[styles.progressSegment, { 
                  transform: [{ rotate: `${getProgress() * 3.6}deg` }] 
                }]} />
              </View>
            )}
          </View>
        </Animated.View>

        {/* Egg Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Egg Size</Text>
          <View style={styles.optionsRow}>
            {renderSizeButton('small', 'Small', '🥚')}
            {renderSizeButton('medium', 'Medium', '🥚')}
            {renderSizeButton('large', 'Large', '🥚')}
          </View>
        </View>

        {/* Doneness Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doneness Level</Text>
          <View style={styles.optionsRow}>
            {renderDonenessButton('soft', 'Soft', '🌊')}
            {renderDonenessButton('medium', 'Medium', '☀️')}
            {renderDonenessButton('hard', 'Hard', '🔥')}
          </View>
        </View>

        {/* Cooking Time Info */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={[colors.cardLight, colors.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoCardGradient}
          >
            <Text style={styles.infoTitle}>Cooking Time</Text>
            <Text style={styles.infoTime}>
              {Math.floor(COOKING_TIMES[eggSize][doneness] / 60)} min
            </Text>
            <Text style={styles.infoDescription}>
              For a {doneness} boiled {eggSize} egg
            </Text>
          </LinearGradient>
        </View>

        {/* Control Buttons */}
        <AnimatedPressable
          style={[styles.controlButtons, buttonAnimatedStyle]}
          onPress={isRunning ? stopTimer : startTimer}
        >
          {!isRunning ? (
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>▶ Start Timer</Text>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={[colors.danger, '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.stopButton}
            >
              <Text style={styles.stopButtonText}>■ Stop Timer</Text>
            </LinearGradient>
          )}
        </AnimatedPressable>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Start timing when water begins to boil
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Use eggs at room temperature for best results
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Place eggs in ice water after cooking to stop the process
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircleOuter: {
    position: 'relative',
    width: 240,
    height: 240,
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.accentLight,
    boxShadow: '0px 8px 24px rgba(245, 158, 11, 0.3)',
    elevation: 8,
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
  },
  progressSegment: {
    width: '100%',
    height: '100%',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accentLight,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
    overflow: 'hidden',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 0,
  },
  gradientButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  optionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionButtonTextSelected: {
    color: colors.text,
  },
  emojiText: {
    fontSize: 28,
    marginBottom: 6,
  },
  infoCard: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
    elevation: 6,
  },
  infoCardGradient: {
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentLight,
    borderRadius: 20,
  },
  infoTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  infoTime: {
    fontSize: 52,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  infoDescription: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  controlButtons: {
    marginBottom: 30,
  },
  startButton: {
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    boxShadow: '0px 8px 24px rgba(245, 158, 11, 0.5)',
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 1,
  },
  stopButton: {
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    boxShadow: '0px 8px 24px rgba(239, 68, 68, 0.5)',
    elevation: 8,
  },
  stopButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 1,
  },
  tipsCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accentLight,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 12,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
