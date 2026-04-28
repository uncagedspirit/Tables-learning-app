/**
 * Sound effects using simple frequency tones via expo-av
 * Falls back silently if audio unavailable
 */

let Audio;
try {
  Audio = require('expo-av').Audio;
} catch (e) {
  Audio = null;
}

let soundCorrect = null;
let soundWrong = null;
let soundLoaded = false;

// Base64 encoded tiny WAV files (generated tones)
// Correct: pleasant ascending ding
// Wrong: low buzz

const correctSoundUri =
  'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3';
const wrongSoundUri =
  'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3';

export async function initSounds() {
  if (!Audio) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
    });
  } catch (e) {
    // ignore
  }
}

export async function playCorrect() {
  if (!Audio) return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: correctSoundUri },
      { shouldPlay: true, volume: 0.6 }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (e) {
    // silent fail
  }
}

export async function playWrong() {
  if (!Audio) return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: wrongSoundUri },
      { shouldPlay: true, volume: 0.5 }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (e) {
    // silent fail
  }
}