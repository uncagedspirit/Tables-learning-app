import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateStreakAfterSession } from '../storage';
import { formatAccuracy } from '../utils/quiz';
import { colors, spacing, radius } from '../utils/theme';

export default function ResultsScreen({ 
  total, 
  correct, 
  wrong, 
  mode,
  onPracticeAgain,
  onBackToHome
}) {
  const [newStreak, setNewStreak] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const accuracy = formatAccuracy(correct, total);
  const accuracyNum = total > 0 ? Math.round((correct / total) * 100) : 0;

  const grade =
    accuracyNum === 100
      ? { label: 'Perfect!', emoji: '🏆', color: colors.success }
      : accuracyNum >= 80
      ? { label: 'Great job', emoji: '⭐', color: colors.primary }
      : accuracyNum >= 60
      ? { label: 'Good effort', emoji: '💪', color: colors.warn }
      : { label: 'Keep practicing', emoji: '📚', color: colors.textSecondary };

  useEffect(() => {
    if (total > 0 && mode !== 'mistakes') {
      updateStreakAfterSession().then(setNewStreak);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [total, mode, fadeAnim, slideAnim]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Grade */}
          <View style={styles.gradeSection}>
            <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
            <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
          </View>

          {/* Accuracy Big Display */}
          <View style={styles.accuracyCard}>
            <Text style={[styles.accuracyNumber, { color: grade.color }]}>{accuracy}</Text>
            <Text style={styles.accuracyLabel}>accuracy</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{total}</Text>
              <Text style={styles.statLabel}>questions</Text>
            </View>
            <View style={[styles.statDivider]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>{correct}</Text>
              <Text style={styles.statLabel}>correct</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: correct === total && total > 0 ? colors.textMuted : colors.error }]}>{wrong}</Text>
              <Text style={styles.statLabel}>wrong</Text>
            </View>
          </View>

          {/* Streak update */}
          {newStreak !== null && total > 0 && (
            <View style={styles.streakUpdateCard}>
              <Text style={styles.streakFireEmoji}>🔥</Text>
              <View>
                <Text style={styles.streakUpdateTitle}>
                  {newStreak} day streak
                </Text>
                <Text style={styles.streakUpdateSub}>Session complete</Text>
              </View>
            </View>
          )}

          {/* Buttons */}
          {total > 0 && (
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
              onPress={() => onPracticeAgain('practice')}
            >
              <Text style={styles.primaryBtnText}>Practice Again</Text>
              <Text style={styles.primaryBtnArrow}>→</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [styles.homeBtn, pressed && styles.btnPressed]}
            onPress={() => onBackToHome()}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  gradeSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  gradeEmoji: {
    fontSize: 52,
    marginBottom: spacing.sm,
  },
  gradeLabel: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  accuracyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accuracyNumber: {
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 76,
  },
  accuracyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  streakUpdateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakFireEmoji: {
    fontSize: 32,
  },
  streakUpdateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.streak,
    letterSpacing: -0.4,
  },
  streakUpdateSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '400',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg + 2,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  primaryBtnArrow: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  homeBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.985 }],
  },
});
