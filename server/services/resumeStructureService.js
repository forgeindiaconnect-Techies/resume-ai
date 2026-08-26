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
 * Universal Resume Structure Extractor
 * Uses Gemini to parse any resume text into structured JSON,
 * supporting all professions (IT, Finance, Healthcare, Sales, HR, Teaching, etc.)
 * and distinguishing freshers from experienced candidates without fixed skill or city lists.
 */
const extractResumeStructure = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment.");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are an expert universal ATS parser. Analyze the following resume text and extract the structured information in JSON.
Support all professions (engineering, healthcare, accounting, sales, human resources, education, design, management, etc.).
Do not invent any facts, dates, skills or contact details.

RESUME TEXT:
${resumeText}

Return a valid JSON object matching this schema exactly:
{
  "candidateLevel": "fresher" | "experienced",
  "detectedName": "string or empty",
  "targetRoles": ["string"],
  "sectionsDetected": {
    "summary": boolean,
    "experience": boolean,
    "education": boolean,
    "skills": boolean,
    "projects": boolean,
    "certifications": boolean,
    "achievements": boolean
  },
  "contact": {
    "namePresent": boolean,
    "emailPresent": boolean,
    "emailValue": "string or empty",
    "phonePresent": boolean,
    "phoneValue": "string or empty",
    "locationPresent": boolean,
    "locationValue": "string or empty",
    "linkedinPresent": boolean,
    "linkedinUrl": "string or empty",
    "portfolioPresent": boolean,
    "portfolioUrl": "string or empty"
  },
  "professionalSummary": {
    "present": boolean,
    "text": "string",
    "wordCount": number,
    "describesRole": boolean,
    "hasClearValueProposition": boolean
  },
  "skills": [
    {
      "name": "string",
      "category": "technical" | "functional" | "soft" | "tool"
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "responsibilities": ["string"],
      "hasQuantifiableMetrics": boolean
    }
  ],
  "projects": [
    {
      "title": "string",
      "toolsOrTech": ["string"],
      "description": "string",
      "hasMeasurableOutcomes": boolean
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "yearOrDuration": "string",
      "scoreOrGpa": "string or empty"
    }
  ],
  "certifications": ["string"],
  "contentQuality": {
    "actionVerbsUsedCount": number,
    "quantifiableMetricsCount": number,
    "hasSpellingOrGrammarCues": boolean,
    "estimatedReadability": "High" | "Medium" | "Low"
  },
  "formattingObservations": {
    "hasCleanStructure": boolean,
    "hasExcessiveSpecialSymbols": boolean,
    "estimatedPageCount": number
  }
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
      throw new Error("Empty response received from AI structure extractor.");
    }

    return JSON.parse(cleanJsonResponse(text));
  } catch (err) {
    console.error("Failed to extract resume structure with Gemini:", err.message);
    return fallbackExtractResumeStructure(resumeText);
  }
};

/**
 * Robust regex-based fallback extractor in case of AI network timeout
 */
const fallbackExtractResumeStructure = (resumeText) => {
  const text = resumeText || "";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d{1,4}[\s-]?)?\(?\d{2,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/(github\.com\/[\w-]+|portfolio|behance\.net)/i);

  const hasSummary = /\b(summary|objective|profile|about me)\b/i.test(text);
  const hasExperience = /\b(experience|employment|work history|internship)\b/i.test(text);
  const hasEducation = /\b(education|academic|degree|bachelor|master|b\.tech|b\.e|diploma)\b/i.test(text);
  const hasSkills = /\b(skills|technologies|proficiencies|competencies)\b/i.test(text);
  const hasProjects = /\b(projects|academic project|personal project)\b/i.test(text);
  const hasCerts = /\b(certification|certifications|courses|training)\b/i.test(text);

  const isFresher = !hasExperience || /\b(fresher|student|intern|pursuing|entry[- ]level)\b/i.test(text);

  return {
    candidateLevel: isFresher ? "fresher" : "experienced",
    detectedName: lines.length > 0 ? lines[0] : "",
    targetRoles: [],
    sectionsDetected: {
      summary: hasSummary,
      experience: hasExperience,
      education: hasEducation,
      skills: hasSkills,
      projects: hasProjects,
      certifications: hasCerts,
      achievements: false,
    },
    contact: {
      namePresent: lines.length > 0,
      emailPresent: Boolean(emailMatch),
      emailValue: emailMatch ? emailMatch[0] : "",
      phonePresent: Boolean(phoneMatch),
      phoneValue: phoneMatch ? phoneMatch[0] : "",
      locationPresent: true,
      locationValue: "",
      linkedinPresent: Boolean(linkedinMatch),
      linkedinUrl: linkedinMatch ? linkedinMatch[0] : "",
      portfolioPresent: Boolean(githubMatch),
      portfolioUrl: githubMatch ? githubMatch[0] : "",
    },
    professionalSummary: {
      present: hasSummary,
      text: "",
      wordCount: 0,
      describesRole: true,
      hasClearValueProposition: true,
    },
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    contentQuality: {
      actionVerbsUsedCount: 3,
      quantifiableMetricsCount: 1,
      hasSpellingOrGrammarCues: false,
      estimatedReadability: "Medium",
    },
    formattingObservations: {
      hasCleanStructure: true,
      hasExcessiveSpecialSymbols: false,
      estimatedPageCount: 1,
    },
  };
};

module.exports = {
  extractResumeStructure,
  fallbackExtractResumeStructure,
};
