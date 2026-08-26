const SECTION_PATTERNS = {
  summary:
    /\b(professional summary|career summary|career objective|profile|objective|about me)\b/i,

  experience:
    /\b(work experience|professional experience|employment history|internship experience|internships)\b/i,

  education:
    /\b(education|academic background|academic qualification|academic qualifications|qualifications)\b/i,

  skills:
    /\b(technical skills|core skills|key skills|skills|technologies)\b/i,

  projects:
    /\b(project|projects|academic project|academic projects|personal project|personal projects|professional projects)\b/i,

  certifications:
    /\b(certification|certifications|courses|training)\b/i,
};

const HEADING_RULES = [
  {
    key: "summary",
    pattern:
      /^(professional summary|career summary|career objective|profile|objective|about me)$/i,
  },
  {
    key: "experience",
    pattern:
      /^(work experience|professional experience|employment history|internship experience|internships)$/i,
  },
  {
    key: "education",
    pattern:
      /^(education|academic background|academic qualifications?|qualifications)$/i,
  },
  {
    key: "skills",
    pattern:
      /^(technical skills|core skills|key skills|skills|technologies)$/i,
  },
  {
    key: "projects",
    pattern:
      /^(projects?|academic projects?|personal projects?|professional projects?)$/i,
  },
  {
    key: "certifications",
    pattern:
      /^(certifications?|courses?|training)$/i,
  },
  {
    key: "other",
    pattern:
      /^(declaration|languages?|interests?|hobbies|personal details|references?)$/i,
  },
];

const cleanHeading = (line) => {
  return line
    .trim()
    .replace(/[:\-–—]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const detectSectionHeading = (line) => {
  const cleanedLine = cleanHeading(line);

  if (!cleanedLine || cleanedLine.length > 60) {
    return null;
  }

  const matchedRule = HEADING_RULES.find((rule) =>
    rule.pattern.test(cleanedLine)
  );

  return matchedRule ? matchedRule.key : null;
};

const extractResumeSections = (text) => {
  const sections = {
    contact: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    other: [],
  };

  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let currentSection = "contact";

  lines.forEach((line) => {
    const detectedHeading = detectSectionHeading(line);

    if (detectedHeading) {
      currentSection = detectedHeading;
      return;
    }

    sections[currentSection].push(line);
  });

  return Object.fromEntries(
    Object.entries(sections).map(([key, linesList]) => [
      key,
      linesList.join("\n").trim(),
    ])
  );
};

const createSectionInput = (heading, sectionText) => {
  if (!sectionText || !sectionText.trim()) {
    return "";
  }

  return `${heading}\n${sectionText.trim()}`;
};

const ACTION_VERBS = [
  "achieved",
  "built",
  "created",
  "developed",
  "designed",
  "implemented",
  "improved",
  "increased",
  "led",
  "managed",
  "optimized",
  "reduced",
  "resolved",
  "delivered",
  "automated",
];

const TECHNICAL_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "node.js",
  "nodejs",
  "express",
  "mongodb",
  "mysql",
  "html",
  "css",
  "python",
  "java",
  "git",
  "github",
  "rest api",
  "aws",
  "docker",
];

const createCategory = (maximum) => ({
  score: 0,
  maximum,
  issues: [],
  strengths: [],
});

const addIssue = (category, message, pointsLost) => {
  category.issues.push({
    message,
    pointsLost,
  });
};

const analyzeContact = (text) => {
  const result = createCategory(10);

  const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
  const hasPhone =
    /(?:\+?91[\s-]?)?[6-9]\d{9}\b|\+?\d[\d\s()-]{8,}\d/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/[\w-]+/i.test(text);
  const hasPortfolio =
    /(github\.com\/[\w-]+|portfolio|behance\.net|website\s*:)/i.test(text);
  const hasLocation =
    /\b(chennai|bangalore|bengaluru|hyderabad|mumbai|delhi|pune|india|tamil nadu)\b/i.test(
      text
    );

  if (hasEmail) result.score += 2;
  else addIssue(result, "Add a professional email address.", 2);

  if (hasPhone) result.score += 2;
  else addIssue(result, "Add a valid mobile number.", 2);

  // A readable resume containing several words is treated as having a name.
  if (text.split(/\s+/).length >= 5) result.score += 2;
  else addIssue(result, "Add your full name at the top of the resume.", 2);

  if (hasLinkedIn) result.score += 2;
  else addIssue(result, "Add your LinkedIn profile URL.", 2);

  if (hasLocation) result.score += 1;
  else addIssue(result, "Add your city or location.", 1);

  if (hasPortfolio) result.score += 1;
  else addIssue(result, "Add a portfolio or GitHub link.", 1);

  if (result.score >= 8) {
    result.strengths.push("Contact information is clearly presented.");
  }

  return result;
};

const analyzeSummary = (text) => {
  const result = createCategory(10);
  const hasSummary = SECTION_PATTERNS.summary.test(text);

  if (hasSummary) result.score += 4;
  else {
    addIssue(result, "Add a professional summary section.", 4);
    addIssue(result, "Mention your target role in the summary.", 2);
    addIssue(result, "Include important skills in the summary.", 2);
    addIssue(result, "Write a focused summary of approximately 40–100 words.", 2);
    return result;
  }

  const hasRole =
    /\b(developer|engineer|designer|manager|analyst|consultant|specialist|intern)\b/i.test(
      text
    );

  const detectedSkills = TECHNICAL_SKILLS.filter((skill) =>
    text.toLowerCase().includes(skill)
  );

  if (hasRole) result.score += 2;
  else addIssue(result, "Mention your target job role in the summary.", 2);

  if (detectedSkills.length >= 2) result.score += 2;
  else addIssue(result, "Mention relevant skills in the summary.", 2);

  const summaryWordCount = text
    .split(/\s+/)
    .filter(Boolean).length;

  if (summaryWordCount >= 40 && summaryWordCount <= 120) {
    result.score += 2;
  } else if (summaryWordCount < 40) {
    addIssue(
      result,
      "Write a focused professional summary of approximately 40–100 words.",
      2
    );
  } else {
    addIssue(
      result,
      "Shorten the professional summary to approximately 40–100 words.",
      2
    );
  }

  return result;
};

const analyzeExperience = (text) => {
  const result = createCategory(20);

  if (SECTION_PATTERNS.experience.test(text)) result.score += 5;
  else addIssue(result, "Add a Work Experience section.", 5);

  if (
    /\b(developer|engineer|manager|designer|analyst|intern|executive)\b/i.test(
      text
    )
  ) {
    result.score += 3;
  } else {
    addIssue(result, "Include your job title for every position.", 3);
  }

  if (
    /\b(19|20)\d{2}\b|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(
      text
    )
  ) {
    result.score += 3;
  } else {
    addIssue(result, "Add employment start and end dates.", 3);
  }

  if (/•|●|▪|◦|-\s+[A-Za-z]/.test(text)) result.score += 3;
  else addIssue(result, "Use bullet points for responsibilities.", 3);

  const actionVerbCount = ACTION_VERBS.filter((verb) =>
    text.toLowerCase().includes(verb)
  ).length;

  if (actionVerbCount >= 3) result.score += 2;
  else addIssue(result, "Use strong action verbs in experience bullet points.", 2);

  if (/\b\d+%|\b\d+\+|\b₹[\d,]+|\b\d+\s*(users|clients|projects|hours)\b/i.test(text)) {
    result.score += 4;
  } else {
    addIssue(
      result,
      "Add measurable achievements using numbers, percentages or results.",
      4
    );
  }

  return result;
};

const analyzeEducation = (text) => {
  const result = createCategory(10);

  if (SECTION_PATTERNS.education.test(text)) result.score += 4;
  else addIssue(result, "Add an Education section.", 4);

  if (/\b(b\.?e|b\.?tech|m\.?tech|bsc|msc|bca|mca|mba|degree|diploma)\b/i.test(text)) {
    result.score += 2;
  } else addIssue(result, "Mention your degree or qualification.", 2);

  if (/\b(college|university|institute|school)\b/i.test(text)) result.score += 2;
  else addIssue(result, "Mention your institution name.", 2);

  if (/\b(19|20)\d{2}\b/.test(text)) result.score += 2;
  else addIssue(result, "Add your graduation year.", 2);

  return result;
};

const analyzeSkills = (text) => {
  const result = createCategory(15);
  const lowerText = text.toLowerCase();

  const detectedSkills = TECHNICAL_SKILLS.filter((skill) =>
    lowerText.includes(skill)
  );

  if (SECTION_PATTERNS.skills.test(text)) result.score += 5;
  else addIssue(result, "Add a dedicated Skills section.", 5);

  if (detectedSkills.length >= 5) result.score += 4;
  else addIssue(result, "Include at least five relevant professional skills.", 4);

  if (detectedSkills.length >= 3) result.score += 3;
  else addIssue(result, "Add more job-relevant technical skills.", 3);

  if (detectedSkills.length >= 7) result.score += 3;
  else addIssue(result, "Expand your skills based on the target role.", 3);

  return {
    ...result,
    detectedSkills,
  };
};

const analyzeProjects = (text) => {
  const result = createCategory(10);

  if (SECTION_PATTERNS.projects.test(text)) result.score += 4;
  else addIssue(result, "Add a Projects section.", 4);

  if (/\b(project|application|website|system|platform|dashboard)\b/i.test(text)) {
    result.score += 2;
  } else addIssue(result, "Describe the purpose of each project.", 2);

  if (TECHNICAL_SKILLS.some((skill) => text.toLowerCase().includes(skill))) {
    result.score += 2;
  } else addIssue(result, "Mention the technologies used in each project.", 2);

  if (/\b\d+%|\b\d+\+|\b(improved|reduced|increased|completed|deployed)\b/i.test(text)) {
    result.score += 2;
  } else addIssue(result, "Mention project results or achievements.", 2);

  return result;
};

const analyzeFormatting = (text) => {
  const result = createCategory(10);

  const detectedSections = Object.values(SECTION_PATTERNS).filter((pattern) =>
    pattern.test(text)
  ).length;

  if (detectedSections >= 4) result.score += 4;
  else addIssue(result, "Use standard ATS-friendly section headings.", 4);

  if (text.length >= 500) result.score += 2;
  else addIssue(result, "The resume contains too little readable content.", 2);

  if (text.length <= 12000) result.score += 2;
  else addIssue(result, "The resume may be too long.", 2);

  if (!/[★◆■▶]{5,}/.test(text)) result.score += 2;
  else addIssue(result, "Avoid excessive decorative symbols.", 2);

  return result;
};

const analyzeContentQuality = (text) => {
  const result = createCategory(10);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount >= 200 && wordCount <= 1200) result.score += 3;
  else addIssue(result, "Keep the resume between approximately 200–1200 words.", 3);

  const actionVerbCount = ACTION_VERBS.filter((verb) =>
    text.toLowerCase().includes(verb)
  ).length;

  if (actionVerbCount >= 3) result.score += 3;
  else addIssue(result, "Use more achievement-focused action verbs.", 3);

  if (/•|●|▪|◦|-\s+[A-Za-z]/.test(text)) result.score += 2;
  else addIssue(result, "Use concise bullet points for readability.", 2);

  if (/\b\d+%|\b\d+\+/.test(text)) result.score += 2;
  else addIssue(result, "Include measurable results where accurate.", 2);

  return result;
};

const analyzeJobMatch = (resumeText, jobDescription) => {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      score: null,
      maximum: 5,
      analyzed: false,
      matchedKeywords: [],
      missingKeywords: [],
      issues: [],
      strengths: [],
    };
  }

  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  const relevantKeywords = TECHNICAL_SKILLS.filter((skill) =>
    jobLower.includes(skill)
  );

  const matchedKeywords = relevantKeywords.filter((skill) =>
    resumeLower.includes(skill)
  );

  const missingKeywords = relevantKeywords.filter(
    (skill) => !resumeLower.includes(skill)
  );

  const score =
    relevantKeywords.length === 0
      ? 5
      : Math.round((matchedKeywords.length / relevantKeywords.length) * 5);

  return {
    score,
    maximum: 5,
    analyzed: true,
    matchedKeywords,
    missingKeywords,
    issues:
      missingKeywords.length > 0
        ? [
            {
              message:
                "Some job-description skills are not found in your resume. Add them only if they accurately represent your experience.",
              pointsLost: 5 - score,
            },
          ]
        : [],
    strengths:
      score >= 4 ? ["The resume matches most detected job keywords."] : [],
  };
};

const scoreResume = (text, jobDescription = "") => {
  const sections = extractResumeSections(text);

  const summaryInput = createSectionInput(
    "professional summary",
    sections.summary
  );

  const experienceInput = createSectionInput(
    "work experience",
    sections.experience
  );

  const educationInput = createSectionInput(
    "education",
    sections.education
  );

  const skillsInput = createSectionInput(
    "technical skills",
    sections.skills
  );

  const projectsInput = createSectionInput(
    "projects",
    sections.projects
  );

  const categories = {
    contact: analyzeContact(
      sections.contact || text
    ),

    summary: analyzeSummary(
      summaryInput
    ),

    experience: analyzeExperience(
      experienceInput
    ),

    education: analyzeEducation(
      educationInput
    ),

    skills: analyzeSkills(
      skillsInput
    ),

    projects: analyzeProjects(
      projectsInput
    ),

    formatting: analyzeFormatting(
      text
    ),

    contentQuality: analyzeContentQuality(
      text
    ),

    jobMatch: analyzeJobMatch(
      text,
      jobDescription
    ),
  };

  let earned = 0;
  let available = 0;

  Object.values(categories).forEach((category) => {
    if (
      typeof category.score === "number" &&
      typeof category.maximum === "number"
    ) {
      earned += category.score;
      available += category.maximum;
    }
  });

  const overallScore =
    available > 0
      ? Math.round((earned / available) * 100)
      : 0;

  const scoreLevel =
    overallScore >= 90
      ? "Excellent"
      : overallScore >= 75
        ? "Good"
        : overallScore >= 60
          ? "Needs Improvement"
          : "Poor";

  const issues = [];
  const strengths = [];

  Object.entries(categories).forEach(
    ([categoryName, category]) => {
      (category.issues || []).forEach((issue) => {
        issues.push({
          category: categoryName,
          ...issue,
        });
      });

      (category.strengths || []).forEach(
        (strength) => {
          strengths.push({
            category: categoryName,
            message:
              typeof strength === "string"
                ? strength
                : strength.message,
          });
        }
      );
    }
  );

  return {
    overallScore,
    scoreLevel,
    categoryScores: categories,

    issues: issues.sort(
      (first, second) =>
        second.pointsLost - first.pointsLost
    ),

    strengths,

    matchedKeywords:
      categories.jobMatch.matchedKeywords || [],

    missingKeywords:
      categories.jobMatch.missingKeywords || [],

    detectedSections: {
      summary: Boolean(sections.summary),
      experience: Boolean(sections.experience),
      education: Boolean(sections.education),
      skills: Boolean(sections.skills),
      projects: Boolean(sections.projects),
      certifications: Boolean(
        sections.certifications
      ),
    },
  };
};

module.exports = {
  scoreResume,
};
