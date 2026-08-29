import * as Speech from 'expo-speech';

/**
 * Natural English Text-to-Speech audio player for flashcards.
 * Resolves when speech finishes (or is stopped / errors).
 */
export function playExpressionAudio(id: string, text: string): Promise<void> {
  return new Promise(async (resolve) => {
    try {
      await Speech.stop();

      if (!text || text.trim().length === 0) {
        resolve();
        return;
      }

      const naturalText = text
        .replace(/\s*\/\s*/g, ', or ')
        .replace(/\((.*?)\)/g, ', $1, ');

      Speech.speak(naturalText, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.88,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: () => resolve(),
      });
    } catch (err) {
      console.warn('[audioPlayer] Speech playback error:', err);
      resolve();
    }
  });
}

/**
 * Stops any ongoing speech playback.
 */
export async function stopExpressionAudio(): Promise<void> {
  try {
    await Speech.stop();
  } catch (err) {
    console.warn('[audioPlayer] Error stopping speech:', err);
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
