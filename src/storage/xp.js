import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  XP: 'multiply_xp',
  LEVEL: 'multiply_level',
  TOTAL_CORRECT: 'multiply_total_correct',
  BEST_ACCURACY: 'multiply_best_accuracy',
  SESSIONS: 'multiply_sessions',
};

const XP_PER_CORRECT = 10;
const XP_PER_LEVEL = 100;

export function getLevelFromXP(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXPProgress(xp) {
  const xpInLevel = xp % XP_PER_LEVEL;
  return { current: xpInLevel, max: XP_PER_LEVEL, percent: xpInLevel / XP_PER_LEVEL };
}

export async function getXPData() {
  try {
    const [xpRaw, correctRaw, accuracyRaw, sessionsRaw] = await Promise.all([
      AsyncStorage.getItem(KEYS.XP),
      AsyncStorage.getItem(KEYS.TOTAL_CORRECT),
      AsyncStorage.getItem(KEYS.BEST_ACCURACY),
      AsyncStorage.getItem(KEYS.SESSIONS),
    ]);
    const xp = xpRaw ? parseInt(xpRaw, 10) : 0;
    return {
      xp,
      level: getLevelFromXP(xp),
      progress: getXPProgress(xp),
      totalCorrect: correctRaw ? parseInt(correctRaw, 10) : 0,
      bestAccuracy: accuracyRaw ? parseInt(accuracyRaw, 10) : 0,
      sessions: sessionsRaw ? parseInt(sessionsRaw, 10) : 0,
    };
  } catch {
    return { xp: 0, level: 1, progress: { current: 0, max: 100, percent: 0 }, totalCorrect: 0, bestAccuracy: 0, sessions: 0 };
  }
}

export async function addXP(correct, total) {
  try {
    const data = await getXPData();
    const earned = correct * XP_PER_CORRECT;
    const newXP = data.xp + earned;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const newBest = Math.max(data.bestAccuracy, accuracy);
    const newSessions = data.sessions + 1;
    await Promise.all([
      AsyncStorage.setItem(KEYS.XP, String(newXP)),
      AsyncStorage.setItem(KEYS.TOTAL_CORRECT, String(data.totalCorrect + correct)),
      AsyncStorage.setItem(KEYS.BEST_ACCURACY, String(newBest)),
      AsyncStorage.setItem(KEYS.SESSIONS, String(newSessions)),
    ]);
    return { earned, newXP, level: getLevelFromXP(newXP), levelUp: getLevelFromXP(newXP) > getLevelFromXP(data.xp) };
  } catch {
    return { earned: 0, newXP: 0, level: 1, levelUp: false };
  }
}