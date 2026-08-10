import * as Speech from 'expo-speech';

/**
 * Natural English Text-to-Speech audio player for flashcards.
 * Formats multiple options cleanly (e.g. "Option A / Option B" -> "Option A, or Option B").
 */
export async function playExpressionAudio(id: string, text: string): Promise<void> {
  try {
    // Stop any existing speech playback immediately
    await Speech.stop();

    if (!text || text.trim().length === 0) return;

    // Format slashes or parentheticals for natural English spoken rhythm
    const naturalText = text
      .replace(/\s*\/\s*/g, ', or ')
      .replace(/\((.*?)\)/g, ', $1, ');

    Speech.speak(naturalText, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.88, // Conversational pacing
    });
  } catch (err) {
    console.warn('[audioPlayer] Speech playback error:', err);
  }
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
