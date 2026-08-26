const { GoogleGenAI } = require("@google/genai");

const cleanJsonResponse = (value) => {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const generateResumeImprovements = async ({
  resumeText,
  scoringResult,
  jobDescription = "",
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are a professional ATS resume reviewer.

Analyze the supplied resume using the already-calculated ATS results.

Important rules:
1. Do not invent employment, education, skills, numbers or achievements.
2. Do not change the calculated ATS score.
3. Explain exactly why the resume needs improvement.
4. Provide clear, professional examples.
5. Use placeholders such as [enter accurate percentage] when a number is unknown.
6. Recommend a missing skill only when it appears in the job description.
7. Return valid JSON only.
8. Do not include Markdown or code fences.

RESUME TEXT:
${resumeText}

CALCULATED ATS RESULT:
${JSON.stringify(scoringResult)}

JOB DESCRIPTION:
${jobDescription || "Not provided"}

Return this exact JSON structure:

{
  "professionalSummary": "Short overall assessment",
  "criticalIssues": [
    {
      "section": "Section name",
      "problem": "Exact problem",
      "whyItMatters": "Why recruiters or ATS systems care",
      "suggestion": "Specific correction"
    }
  ],
  "sectionImprovements": [
    {
      "section": "Section name",
      "currentProblem": "Problem with the current content",
      "improvedExample": "A professional rewritten example without invented facts"
    }
  ],
  "recommendedKeywords": [],
  "priorityActions": [],
  "disclaimer": "Suggestions must be reviewed and verified by the user."
}
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const responseText =
    typeof response.text === "function"
      ? response.text()
      : response.text;

  if (!responseText) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(cleanJsonResponse(responseText));
  } catch (error) {
    console.error("Gemini JSON parsing error:", responseText);

    throw new Error("Gemini returned an invalid analysis response.");
  }
};

module.exports = {
  generateResumeImprovements,
};
