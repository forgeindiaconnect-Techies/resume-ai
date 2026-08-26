const { GoogleGenAI } = require("@google/genai");

const cleanJsonResponse = (value) => {
  if (!value) return "";
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

/**
 * Universal Job Description Requirement Extractor
 * Uses Gemini to parse job descriptions dynamically for any role or field.
 */
const extractJobRequirements = async (jobDescriptionText) => {
  if (!jobDescriptionText || !jobDescriptionText.trim()) {
    return null;
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment.");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are an expert recruitment and ATS specialist.
Analyze the following Job Description and extract the key criteria into structured JSON.
Be precise and extract only skills, technologies, certifications, and responsibilities explicitly stated or clearly implied.

JOB DESCRIPTION:
${jobDescriptionText}

Return a valid JSON object matching this exact schema:
{
  "jobTitle": "string",
  "industry": "string",
  "experienceLevelRequired": "fresher" | "junior" | "mid" | "senior" | "any",
  "mandatorySkills": ["string"],
  "preferredSkills": ["string"],
  "educationRequirements": ["string"],
  "keyResponsibilities": ["string"],
  "certificationsRequired": ["string"]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const text =
      typeof response.text === "function" ? response.text() : response.text;

    if (!text) {
      throw new Error("Empty response received from AI JD extractor.");
    }

    return JSON.parse(cleanJsonResponse(text));
  } catch (err) {
    console.error("Failed to extract JD requirements with Gemini:", err.message);
    // Fallback extraction
    return fallbackExtractJobRequirements(jobDescriptionText);
  }
};

const fallbackExtractJobRequirements = (jdText) => {
  const text = jdText || "";
  const words = text
    .split(/[\s,;()\n]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2);

  // Extract distinct capitalized words or short terms
  const potentialSkills = Array.from(new Set(words.slice(0, 15)));

  return {
    jobTitle: "Target Position",
    industry: "General",
    experienceLevelRequired: "any",
    mandatorySkills: potentialSkills.slice(0, 6),
    preferredSkills: potentialSkills.slice(6, 12),
    educationRequirements: ["Bachelor's degree or equivalent"],
    keyResponsibilities: [],
    certificationsRequired: [],
  };
};

module.exports = {
  extractJobRequirements,
};
