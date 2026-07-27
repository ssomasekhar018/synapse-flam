import { parseAIResponse } from '../utils/parseAIResponse';

const CLIENT_TIMEOUT_MS = 20000; // 20 seconds timeout constraint

/**
 * Fetch generated study materials from the server backend proxy.
 * 
 * @param {object} params
 * @param {string} params.topic
 * @param {string} params.difficulty
 * @param {string} [params.mockError] Optional mock error flag for testing pass
 * @param {AbortSignal} [params.signal] AbortSignal for race-condition cancellation
 * @returns {Promise<{ flashcards: Array, quiz: Array }>}
 */
export async function generateStudyMaterials({ topic, difficulty, mockError, signal }) {
  // Setup client timeout using AbortController combination
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new Error('CLIENT_TIMEOUT'));
  }, CLIENT_TIMEOUT_MS);

  // Combine external abort signal with timeout signal
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutController.signal]) : timeoutController.signal;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, difficulty, mockError }),
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError = errorText;
      try {
        const errJson = JSON.parse(errorText);
        parsedError = errJson.error || errorText;
      } catch (e) {
        // Keep raw text if not JSON
      }
      throw new Error(`Server returned error status ${response.status}: ${parsedError}`);
    }

    const rawText = await response.text();

    // Step 2 & 6: Clean, parse, and validate Zod schema contract
    const result = parseAIResponse(rawText);

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError' || err.message === 'CLIENT_TIMEOUT') {
      if (timeoutController.signal.aborted) {
        throw new Error('Request timed out (20s limit). The AI model is taking longer than expected. Please try again.');
      }
      // External abort (e.g. newer request started)
      throw err;
    }

    if (err.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to reach backend server proxy. Please check your connection.');
    }

    throw err;
  }
}
