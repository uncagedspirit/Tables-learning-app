import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  StatusBar,
  Keyboard,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateQuestion, generateQuestionFromList } from '../utils/quiz';
import { getMistakes, addMistake, removeMistake } from '../storage';
import { colors, spacing, radius } from '../utils/theme';
import { playCorrect, playWrong } from '../utils/sounds';

const FEEDBACK_DURATION = 900;

export default function QuizScreen({ mode, onEndSession, onNavigateHome }) {
  const isMistakesMode = mode === 'mistakes';

  const [question, setQuestion] = useState(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [session, setSession] = useState({ total: 0, correct: 0, wrong: 0 });
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [combo, setCombo] = useState(0); // consecutive correct answers

  const inputRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;

  const loadNextQuestion = useCallback((currentMistakes) => {
    setFeedback(null);
    setCorrectAnswer(null);
    setInput('');
    setIsSubmitting(false);

    let q;
    if (isMistakesMode) {
      if (!currentMistakes || currentMistakes.length === 0) {
        onNavigateHome();
        return;
      }
      q = generateQuestionFromList(currentMistakes);
    } else {
      q = generateQuestion();
    }

    setQuestion(q);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      inputRef.current?.focus();
      Keyboard.dismiss();
    }, 100);
  }, [isMistakesMode, fadeAnim, onNavigateHome]);

  useEffect(() => {
    (async () => {
      const m = await getMistakes();
      setMistakes(m);
      if (isMistakesMode && m.length === 0) {
        onNavigateHome();
        return;
      }
      setLoading(false);
      loadNextQuestion(m);
    })();
  }, [isMistakesMode, onNavigateHome, loadNextQuestion]);

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const triggerComboAnim = () => {
    comboAnim.setValue(0);
    Animated.sequence([
      Animated.timing(comboAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(400),
      Animated.timing(comboAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = useCallback(async () => {
    if (!question || isSubmitting || feedback !== null) return;
    const trimmed = input.trim();
    if (!trimmed || isNaN(Number(trimmed))) return;

    setIsSubmitting(true);
    Keyboard.dismiss();

    const userAnswer = parseInt(trimmed, 10);
    const isCorrect = userAnswer === question.answer;

    if (isCorrect) {
      playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo >= 3) triggerComboAnim();
      setFeedback('correct');
      setSession((s) => ({ ...s, total: s.total + 1, correct: s.correct + 1 }));
      if (isMistakesMode) {
        await removeMistake(question.a, question.b);
        const updated = mistakes.filter((m) => m.key !== `${question.a}x${question.b}`);
        setMistakes(updated);
        setTimeout(() => loadNextQuestion(updated), FEEDBACK_DURATION);
      } else {
        setTimeout(() => loadNextQuestion(mistakes), FEEDBACK_DURATION);
      }
    } else {
      playWrong();
      setCombo(0);
      setFeedback('wrong');
      setCorrectAnswer(question.answer);
      triggerShake();
      setSession((s) => ({ ...s, total: s.total + 1, wrong: s.wrong + 1 }));
      if (!isMistakesMode) {
        await addMistake(question.a, question.b);
        const m = await getMistakes();
        setMistakes(m);
      }
      setTimeout(() => loadNextQuestion(isMistakesMode ? mistakes : mistakes), FEEDBACK_DURATION);
    }
  }, [question, input, isSubmitting, feedback, isMistakesMode, mistakes, loadNextQuestion, combo]);

  const handleEndSession = () => {
    onEndSession({
      total: session.total,
      correct: session.correct,
      wrong: session.wrong,
      mode,
    });
  };

  if (loading || !question) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const bgColor =
    feedback === 'correct'
      ? colors.successGlow
      : feedback === 'wrong'
      ? colors.errorGlow
      : 'transparent';

  const comboOpacity = comboAnim;
  const comboScale = comboAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={[styles.feedbackOverlay, { backgroundColor: bgColor }]} pointerEvents="none" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleEndSession} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backBtnText}>← End</Text>
        </Pressable>
        <View style={styles.sessionBadge}>
          <Text style={styles.sessionStat}>
            <Text style={styles.correctCount}>{session.correct}</Text>
            <Text style={styles.sessionDivider}> / </Text>
            <Text style={styles.totalCount}>{session.total}</Text>
          </Text>
        </View>
        {isMistakesMode ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>Review</Text>
          </View>
        ) : (
          combo >= 2 ? (
            <View style={styles.comboBadge}>
              <Text style={styles.comboBadgeText}>🔥 ×{combo}</Text>
            </View>
          ) : (
            <View style={{ width: 60 }} />
          )
        )}
      </View>

      {/* Combo popup */}
      {combo >= 3 && (
        <Animated.View
          style={[
            styles.comboPopup,
            { opacity: comboOpacity, transform: [{ scale: comboScale }] },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.comboPopupText}>
            {combo >= 10 ? '🏆 Unstoppable!' : combo >= 7 ? '⚡ Amazing!' : combo >= 5 ? '🔥 On Fire!' : '✨ Combo!'}
          </Text>
        </Animated.View>
      )}

      {/* Question */}
      <View style={styles.questionArea}>
        <Animated.View
          style={[
            styles.questionCard,
            {
              opacity: fadeAnim,
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <Text style={styles.operandA}>{question.a}</Text>
          <Text style={styles.operator}>×</Text>
          <Text style={styles.operandB}>{question.b}</Text>
          <Text style={styles.equals}>=</Text>
          <View style={styles.answerSlot}>
            {feedback === null ? (
              <Text style={[styles.answerText, !input && styles.answerPlaceholder]}>
                {input || '?'}
              </Text>
            ) : feedback === 'correct' ? (
              <Text style={[styles.answerText, styles.answerCorrect]}>{input}</Text>
            ) : (
              <View style={styles.wrongAnswerRow}>
                <Text style={[styles.answerText, styles.answerWrong]}>{input}</Text>
                <Text style={[styles.answerText, styles.answerCorrectSmall]}>
                  → {correctAnswer}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {feedback === 'correct' && (
          <View style={styles.feedbackMsg}>
            <Text style={styles.feedbackMsgCorrect}>✓ Correct!</Text>
          </View>
        )}
        {feedback === 'wrong' && (
          <View style={styles.feedbackMsg}>
            <Text style={styles.feedbackMsgWrong}>The answer is {correctAnswer}</Text>
          </View>
        )}
      </View>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          ref={inputRef}
          style={[styles.hiddenInput, feedback !== null && styles.hiddenInputDisabled]}
          value={input}
          onChangeText={(text) => {
            if (feedback !== null || isSubmitting) return;
            const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
            setInput(cleaned);
          }}
          keyboardType="default"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={feedback === null && !isSubmitting}
          caretHidden
          blurOnSubmit={false}
          maxLength={4}
          selectionColor={colors.primary}
          showSoftInputOnFocus={false}
        />

        {/* Number Pad */}
        <View style={styles.numpad}>
          {[['1','2','3'],['4','5','6'],['7','8','9'],['⌫','0','↵']].map((row, ri) => (
            <View key={ri} style={styles.numpadRow}>
              {row.map((key) => {
                const isAction = key === '⌫' || key === '↵';
                const isSubmitKey = key === '↵';
                return (
                  <Pressable
                    key={key}
                    style={({ pressed }) => [
                      styles.numpadKey,
                      isAction && styles.numpadKeyAction,
                      isSubmitKey && styles.numpadKeySubmit,
                      pressed && styles.numpadKeyPressed,
                      (feedback !== null || isSubmitting) && styles.numpadKeyDisabled,
                    ]}
                    onPress={() => {
                      if (feedback !== null || isSubmitting) return;
                      if (key === '⌫') {
                        setInput((v) => v.slice(0, -1));
                      } else if (key === '↵') {
                        handleSubmit();
                      } else {
                        setInput((v) => (v.length < 4 ? v + key : v));
                      }
                    }}
                    hitSlop={4}
                  >
                    <Text
                      style={[
                        styles.numpadKeyText,
                        isSubmitKey && styles.numpadKeyTextSubmit,
                      ]}
                    >
                      {key}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 24, color: colors.textMuted },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    zIndex: 1,
  },
  backBtn: { paddingVertical: spacing.sm, paddingRight: spacing.md, width: 60 },
  backBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  sessionBadge: { flex: 1, alignItems: 'center' },
  sessionStat: { fontSize: 16, fontWeight: '700' },
  correctCount: { color: colors.success, fontSize: 18, fontWeight: '800' },
  sessionDivider: { color: colors.textMuted, fontWeight: '400' },
  totalCount: { color: colors.textSecondary },
  modeBadge: {
    backgroundColor: colors.warnDim,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    width: 60,
    alignItems: 'center',
  },
  modeBadgeText: { fontSize: 11, fontWeight: '700', color: colors.warn, letterSpacing: 0.5, textTransform: 'uppercase' },
  comboBadge: {
    backgroundColor: colors.errorGlow,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.streak + '44',
    width: 60,
    alignItems: 'center',
  },
  comboBadgeText: { fontSize: 12, fontWeight: '700', color: colors.streak },
  comboPopup: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.streak + '44',
    zIndex: 99,
  },
  comboPopupText: { fontSize: 16, fontWeight: '800', color: colors.streak },
  questionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  operandA: { fontSize: 52, fontWeight: '800', color: colors.text, letterSpacing: -2 },
  operator: { fontSize: 40, fontWeight: '300', color: colors.primary, letterSpacing: -1, marginHorizontal: spacing.xs },
  operandB: { fontSize: 52, fontWeight: '800', color: colors.text, letterSpacing: -2 },
  equals: { fontSize: 40, fontWeight: '300', color: colors.textMuted, letterSpacing: -1, marginHorizontal: spacing.xs },
  answerSlot: {
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
    paddingHorizontal: spacing.xs,
  },
  answerText: { fontSize: 52, fontWeight: '800', color: colors.text, letterSpacing: -2 },
  answerPlaceholder: { color: colors.border },
  answerCorrect: { color: colors.success },
  answerWrong: { color: colors.error, textDecorationLine: 'line-through', fontSize: 36 },
  wrongAnswerRow: { alignItems: 'center' },
  answerCorrectSmall: { color: colors.success, fontSize: 36 },
  feedbackMsg: { marginTop: spacing.xl, alignItems: 'center' },
  feedbackMsgCorrect: { fontSize: 18, fontWeight: '700', color: colors.success, letterSpacing: 0.3 },
  feedbackMsgWrong: { fontSize: 16, fontWeight: '600', color: colors.error, letterSpacing: 0.2 },
  inputArea: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, zIndex: 1 },
  hiddenInput: { position: 'absolute', opacity: 0, height: 0, width: 0 },
  hiddenInputDisabled: { pointerEvents: 'none' },
  numpad: { gap: spacing.sm },
  numpadRow: { flexDirection: 'row', gap: spacing.sm },
  numpadKey: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg - 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  numpadKeyAction: { backgroundColor: colors.surfaceAlt },
  numpadKeySubmit: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  numpadKeyPressed: { opacity: 0.65, transform: [{ scale: 0.96 }] },
  numpadKeyDisabled: { opacity: 0.4 },
  numpadKeyText: { fontSize: 20, fontWeight: '600', color: colors.text },
  numpadKeyTextSubmit: { color: '#fff', fontWeight: '700' },
});