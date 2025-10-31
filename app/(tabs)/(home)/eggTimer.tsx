
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

export default function EggTimerScreen() {
  const [eggSize, setEggSize] = useState<EggSize>('medium');
  const [doneness, setDoneness] = useState<Doneness>('medium');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

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

  const handleTimerComplete = async () => {
    console.log('Timer completed!');
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

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

  const renderSizeButton = (size: EggSize, label: string) => (
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
      <Text
        style={[
          styles.optionButtonText,
          eggSize === size && styles.optionButtonTextSelected,
        ]}
      >
        {label}
      </Text>
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
      <Text style={styles.emojiText}>{emoji}</Text>
      <Text
        style={[
          styles.optionButtonText,
          doneness === done && styles.optionButtonTextSelected,
        ]}
      >
        {label}
      </Text>
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
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🥚 Perfect Egg Timer</Text>
          <Text style={styles.subtitle}>
            Select your egg size and desired doneness
          </Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
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
          {isRunning && (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${getProgress()}%` },
                ]}
              />
            </View>
          )}
        </View>

        {/* Egg Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Egg Size</Text>
          <View style={styles.optionsRow}>
            {renderSizeButton('small', 'Small')}
            {renderSizeButton('medium', 'Medium')}
            {renderSizeButton('large', 'Large')}
          </View>
        </View>

        {/* Doneness Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doneness</Text>
          <View style={styles.optionsRow}>
            {renderDonenessButton('soft', 'Soft', '🌊')}
            {renderDonenessButton('medium', 'Medium', '☀️')}
            {renderDonenessButton('hard', 'Hard', '🔥')}
          </View>
        </View>

        {/* Cooking Time Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Cooking Time</Text>
          <Text style={styles.infoTime}>
            {Math.floor(COOKING_TIMES[eggSize][doneness] / 60)} minutes
          </Text>
          <Text style={styles.infoDescription}>
            For a {doneness} boiled {eggSize} egg
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          {!isRunning ? (
            <Pressable
              style={styles.startButton}
              onPress={startTimer}
            >
              <Text style={styles.startButtonText}>Start Timer</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.stopButton}
              onPress={stopTimer}
            >
              <Text style={styles.stopButtonText}>Stop Timer</Text>
            </Pressable>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipText}>
            - Start timing when water begins to boil
          </Text>
          <Text style={styles.tipText}>
            - Use eggs at room temperature for best results
          </Text>
          <Text style={styles.tipText}>
            - Place eggs in ice water after cooking to stop the process
          </Text>
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.text,
  },
  timerLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.highlight,
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionButtonTextSelected: {
    color: colors.text,
  },
  emojiText: {
    fontSize: 24,
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  infoTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 16,
    color: colors.text,
  },
  controlButtons: {
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(255, 215, 0, 0.3)',
    elevation: 4,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  stopButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(169, 169, 169, 0.3)',
    elevation: 4,
  },
  stopButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.card,
  },
  tipsCard: {
    backgroundColor: colors.highlight,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
