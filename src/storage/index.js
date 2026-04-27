import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  MISTAKES: 'multiply_mistakes',
  STREAK: 'multiply_streak',
  LAST_ACTIVE: 'multiply_last_active',
};

// --- Mistakes ---
export async function getMistakes() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.MISTAKES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMistakes(mistakes) {
  try {
    await AsyncStorage.setItem(KEYS.MISTAKES, JSON.stringify(mistakes));
  } catch {}
}

export async function addMistake(a, b) {
  const mistakes = await getMistakes();
  const key = `${a}x${b}`;
  const exists = mistakes.some((m) => m.key === key);
  if (!exists) {
    mistakes.push({ key, a, b });
    await saveMistakes(mistakes);
  }
}

export async function removeMistake(a, b) {
  const mistakes = await getMistakes();
  const updated = mistakes.filter((m) => m.key !== `${a}x${b}`);
  await saveMistakes(updated);
}

// --- Streak ---
export async function getStreak() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STREAK);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export async function getLastActive() {
  try {
    return await AsyncStorage.getItem(KEYS.LAST_ACTIVE);
  } catch {
    return null;
  }
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

export async function updateStreakAfterSession() {
  const today = todayString();
  const lastActive = await getLastActive();
  let streak = await getStreak();

  if (lastActive === today) {
    // Already counted today
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActive === yesterdayStr) {
    streak += 1;
  } else {
    streak = 1;
  }

  await AsyncStorage.setItem(KEYS.STREAK, String(streak));
  await AsyncStorage.setItem(KEYS.LAST_ACTIVE, today);
  return streak;
}

export async function getStreakData() {
  const streak = await getStreak();
  const lastActive = await getLastActive();
  const today = todayString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If last active was neither today nor yesterday, streak is broken
  if (lastActive && lastActive !== today && lastActive !== yesterdayStr) {
    await AsyncStorage.setItem(KEYS.STREAK, '0');
    return { streak: 0, lastActive };
  }

  return { streak, lastActive };
}
