import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Trim key defensively — covers env values with accidental spaces/quotes
const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");

if (!apiKey) {
  console.error(
    "[Gemini] GEMINI_API_KEY is missing or empty. Text generation will fail."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

// Safety settings — block only explicit harmful content so general queries pass
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generation config — reasonable defaults for a chat assistant
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Model preference order — first available model will be used
// gemini-2.0-flash is the primary; gemini-2.0-flash-lite is the fallback
const MODEL_NAMES = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash"];

/**
 * Tries each model in MODEL_NAMES order until one succeeds.
 * If all fail with 429, throws the last error.
 */
export const generateTextWithFallback = async (prompt) => {
  let lastError;

  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        safetySettings,
        generationConfig,
      });
      console.log(`[Gemini] Trying model: ${modelName}`);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`[Gemini] Success with model: ${modelName}`);
      return text;
    } catch (err) {
      const status = err.status || err.statusCode;
      console.warn(`[Gemini] Model ${modelName} failed with status ${status}: ${err.message && err.message.slice(0, 100)}`);
      lastError = err;

      // Only continue fallback chain on quota errors (429) or model not found (404)
      if (status !== 429 && status !== 404) {
        throw err;
      }
    }
  }

  throw lastError;
};

// Default export: single model instance (kept for backward compatibility)
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  safetySettings,
  generationConfig,
});

export default geminiModel;