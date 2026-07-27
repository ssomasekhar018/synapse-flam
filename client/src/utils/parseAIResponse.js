import { validateAIResponse } from './validateResponse.js';

/**
 * Strips accidental markdown code block fences and surrounding whitespace from raw string.
 * @param {string} rawText 
 * @returns {string} Clean JSON string
 */
export function cleanRawJSONText(rawText) {
  if (typeof rawText !== 'string') return '';
  let cleaned = rawText.trim();
  
  // Remove starting ```json or ```
  cleaned = cleaned.replace(/^```(?:json)?/i, '');
  // Remove ending ```
  cleaned = cleaned.replace(/```$/i, '');
  
  // Also slice from first '{' to last '}' in case there is trailing prose
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  
  return cleaned.trim();
}

/**
 * Parse and validate AI response text.
 * @param {string} rawText 
 * @returns {{ success: true, data: object } | { success: false, error: string }}
 */
export function parseAIResponse(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return {
      success: false,
      error: 'Empty response received from AI model.',
    };
  }

  const cleanedText = cleanRawJSONText(rawText);

  let parsedObject;
  try {
    parsedObject = JSON.parse(cleanedText);
  } catch (parseErr) {
    return {
      success: false,
      error: `Malformed JSON output from AI model: ${parseErr.message}`,
    };
  }

  // Validate shape via Zod
  return validateAIResponse(parsedObject);
}
