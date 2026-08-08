import * as Speech from 'expo-speech';

/**
 * Plays the English expression with clear, natural pronunciation matching the exact card text.
 */
export async function playExpressionAudio(id: string, text: string) {
  try {
    // Stop any ongoing speech playback
    await Speech.stop();

    if (!text || text.trim().length === 0) return;

    // Clean up slashes like "Are you down? / Are you up for it?" -> "Are you down? ... Are you up for it?"
    const naturalText = text.replace(/\s*\/\s*/g, ', ... ');

    Speech.speak(naturalText, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.88, // Natural conversational speed
    });
  } catch (err) {
    console.warn('Speech playback error:', err);
  }
}
