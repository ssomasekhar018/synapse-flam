// server/api/generate.js
// Serverless function / Express middleware for proxying Gemini API requests.

const SYSTEM_PROMPT = `You are an expert AI tutor. Generate interactive learning materials based on the user's topic or notes.
You MUST reply with ONLY a raw JSON object conforming EXACTLY to the following schema:

{
  "flashcards": [
    {
      "question": "Clear, concise question testing core concept",
      "answer": "Accurate, instructive explanation"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question testing understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}

CRITICAL RULES:
1. Generate between 4 and 6 flashcards.
2. Generate between 4 and 6 quiz questions.
3. Every quiz question MUST have exactly 4 options in the options array.
4. "correctIndex" MUST be an integer between 0 and 3 corresponding to the correct option in options.
5. Do NOT include markdown code fences (no \`\`\`json or \`\`\`).
6. Do NOT include any introductory or concluding text, explanations, or prose. Return strictly valid JSON.`;

/** Models to try, in order. New API keys often cannot use bare gemini-2.5-flash. */
const DEFAULT_MODEL_FALLBACKS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash-latest',
];

function buildModelList() {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  if (fromEnv) {
    return [fromEnv, ...DEFAULT_MODEL_FALLBACKS.filter((m) => m !== fromEnv)];
  }
  return DEFAULT_MODEL_FALLBACKS;
}

async function callGemini({ apiKey, modelName, promptText }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  console.log('[Synapse] Using model:', modelName);
  console.log('[Synapse] Endpoint:', url.replace(apiKey, '***'));

  const apiResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${promptText}` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    }),
  });

  return { apiResponse, modelName };
}

/**
 * Serverless / Express HTTP handler for AI study generation
 */
module.exports = async function handler(req, res) {
  // CORS setup for serverless execution
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { topic, difficulty, mockError } = req.body || {};

  // Testing hooks for Step 6/7 verification
  if (mockError === 'malformed') {
    return res.status(200).send('{"flashcards": [{"question": "What is AI?", "answer": "Artificial Intelligence"}], "quiz": broken json structure...');
  }
  if (mockError === 'wrong_shape') {
    return res.status(200).json({ flashcards: [], quiz: "not an array" });
  }
  if (mockError === 'empty') {
    return res.status(200).send('');
  }
  if (mockError === 'slow') {
    await new Promise((resolve) => setTimeout(resolve, 25000)); // 25s delay to trigger 20s client timeout
    return res.status(200).json({ flashcards: [], quiz: [] });
  }

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'Topic or study notes are required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY environment variable is missing on the server backend proxy.',
    });
  }

  const promptText = `Topic/Notes: ${topic.trim()}\nDifficulty level: ${difficulty || 'medium'}`;
  const modelsToTry = buildModelList();

  try {
    let lastError = null;

    for (const modelName of modelsToTry) {
      const { apiResponse } = await callGemini({ apiKey, modelName, promptText });

      if (apiResponse.ok) {
        const payload = await apiResponse.json();
        const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).send(rawText);
      }

      const errorText = await apiResponse.text();
      console.error(`[Synapse] Gemini error (${modelName}):`, apiResponse.status, errorText);

      const isModelUnavailable =
        apiResponse.status === 404 &&
        (errorText.includes('not found') ||
          errorText.includes('not available') ||
          errorText.includes('NOT_FOUND'));

      lastError = { status: apiResponse.status, errorText, modelName };

      if (isModelUnavailable && modelName !== modelsToTry[modelsToTry.length - 1]) {
        console.warn(`[Synapse] Model ${modelName} unavailable — trying next fallback…`);
        continue;
      }

      return res.status(apiResponse.status).json({
        error: `Gemini API error (${apiResponse.status}) on model "${modelName}": ${errorText}`,
      });
    }

    return res.status(lastError?.status || 502).json({
      error: `Gemini API error (${lastError?.status}): ${lastError?.errorText || 'All model fallbacks failed.'}`,
    });
  } catch (err) {
    console.error('Server proxy request error:', err);
    return res.status(500).json({
      error: `Server proxy failure: ${err.message || 'Failed to contact AI service.'}`,
    });
  }
};
