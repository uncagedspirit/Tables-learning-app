import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMistakes, getStreakData } from '../storage';
import { getXPData, getLevelFromXP, getXPProgress } from '../storage/xp';
import { colors, spacing, radius, typography } from '../utils/theme';
import Logo from '../components/Logo';

export default function HomeScreen({ onStartPractice, onReviewMistakes, onLearnTables }) {
  const [mistakes, setMistakes] = useState([]);
  const [streak, setStreak] = useState(0);
  const [xpData, setXpData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [m, { streak: s }, xp] = await Promise.all([
        getMistakes(),
        getStreakData(),
        getXPData(),
      ]);
      setMistakes(m);
      setStreak(s);
      setXpData(xp);
    } catch (e) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const hasMistakes = mistakes.length > 0;
  const level = xpData ? xpData.level : 1;
  const progress = xpData ? xpData.progress : { current: 0, max: 100, percent: 0 };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Logo size={80} style={styles.logo} />
          <Text style={styles.appTitle}>multiply</Text>
          <Text style={styles.appSubtitle}>master your tables</Text>
        </View>

        {/* Level + XP Bar */}
        {xpData && (
          <View style={styles.xpCard}>
            <View style={styles.xpCardTop}>
              <View style={styles.xpLevelBadge}>
                <Text style={styles.xpLevelText}>LVL {level}</Text>
              </View>
              <View style={styles.xpRight}>
                <Text style={styles.xpLabel}>
                  {xpData.xp} XP
                  {xpData.totalCorrect > 0 && (
                    <Text style={styles.xpSub}>  ·  {xpData.totalCorrect} correct</Text>
                  )}
                </Text>
                <View style={styles.xpBarBg}>
                  <View
                    style={[
                      styles.xpBarFill,
                      { width: `${Math.round(progress.percent * 100)}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakCount}>{streak}</Text>
              <Text style={styles.streakLabel}>day streak</Text>
            </View>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakMessage}>
              {streak === 0
                ? 'Start your streak today'
                : streak === 1
                ? 'Great start!'
                : streak < 7
                ? 'Keep it going!'
                : 'On fire! 🔥'}
            </Text>
          </View>
        </View>

        {/* Mistakes pill */}
        {hasMistakes && (
          <View style={styles.mistakePill}>
            <View style={styles.mistakeDot} />
            <Text style={styles.mistakePillText}>
              {mistakes.length} question{mistakes.length !== 1 ? 's' : ''} to review
            </Text>
          </View>
        )}

        {/* Primary CTA */}
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          onPress={() => onStartPractice('practice')}
        >
          <Text style={styles.primaryBtnText}>Start Practice</Text>
          <Text style={styles.primaryBtnArrow}>→</Text>
        </Pressable>

        {/* Learn Tables */}
        <Pressable
          style={({ pressed }) => [styles.learnBtn, pressed && styles.learnBtnPressed]}
          onPress={onLearnTables}
        >
          <View style={styles.learnBtnInner}>
            <View style={styles.learnBtnLeft}>
              <Text style={styles.learnBtnEmoji}>📖</Text>
              <View>
                <Text style={styles.learnBtnText}>Learn Tables</Text>
                <Text style={styles.learnBtnSub}>2 to 20</Text>
              </View>
            </View>
            <Text style={styles.learnBtnArrow}>→</Text>
          </View>
        </Pressable>

        {/* Mistakes CTA */}
        {hasMistakes && (
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            onPress={() => onReviewMistakes('mistakes')}
          >
            <View style={styles.secondaryBtnInner}>
              <Text style={styles.secondaryBtnText}>Review Mistakes</Text>
              <Text style={styles.secondaryBtnCount}>{mistakes.length}</Text>
            </View>
          </Pressable>
        )}

        {/* Footer hint */}
        <Text style={styles.hint}>Tables from 2 × 2 to 10 × 10</Text>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  logo: {
    marginBottom: spacing.lg,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1.5,
  },
  appSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: spacing.xs,
    letterSpacing: 0.5,
  },
  // XP Card
  xpCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  xpCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  xpLevelBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  xpLevelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  xpRight: {
    flex: 1,
    gap: 6,
  },
  xpLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  xpSub: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '400',
  },
  xpBarBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  // Streak Card
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakEmoji: {
    fontSize: 32,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.streak,
    letterSpacing: -1,
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  streakRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  streakMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'right',
  },
  // Mistake pill
  mistakePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.errorGlow,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.errorDim,
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  mistakeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
  mistakePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
    letterSpacing: 0.3,
  },
  // Primary button
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
  primaryBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  primaryBtnArrow: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  // Learn button
  learnBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  learnBtnPressed: {
    opacity: 0.75,
  },
  learnBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  learnBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  learnBtnEmoji: {
    fontSize: 22,
  },
  learnBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
  learnBtnSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
    fontWeight: '400',
  },
  learnBtnArrow: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '600',
  },
  // Secondary (Mistakes) button
  secondaryBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  secondaryBtnPressed: {
    opacity: 0.75,
  },
  secondaryBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
  secondaryBtnCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
    backgroundColor: colors.errorDim,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});