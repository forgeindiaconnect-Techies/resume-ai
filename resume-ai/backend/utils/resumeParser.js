const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const escapeRegExp = (string) => {
  if (!string || typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const extractTextFromPDF = async (buffer) => {
  try {
    if (!buffer) return "";
    
    // Primary: pdfjs-dist
    try {
      // pdfjs-dist v5+ is ESM only, use dynamic import
      const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const loadingTask = getDocument({
        data: new Uint8Array(buffer),
        useSystemFonts: true,
        isEvalSupported: false,
        disableFontFace: true
      });

      const pdf = await loadingTask.promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
      }
      if (fullText.trim().length > 0) return fullText;
    } catch (e) {
      console.warn('[Parser] pdfjs failed, falling back...');
    }

    // Fallback: pdf-parse
    const parser = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
    if (typeof parser === 'function') {
      const data = await parser(buffer);
      return data.text || "";
    }
    return "";
  } catch (e) {
    return "";
  }
};

const extractTextFromDOCX = async (buffer) => {
  try {
    const parser = mammoth.extractRawText ? mammoth : mammoth.default;
    const result = await parser.extractRawText({ buffer });
    return result.value || "";
  } catch (e) {
    return "";
  }
};

// ... (after categories)
const roleKeywords = {
  'Frontend': ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript', 'Redux', 'Tailwind', 'API Integration', 'Next.js', 'Vue'],
  'Backend': ['Node.js', 'Express', 'SQL', 'NoSQL', 'APIs', 'Authentication', 'Docker', 'Redis', 'Python', 'Java'],
  'Fullstack': ['React', 'Node.js', 'Express', 'SQL', 'JavaScript', 'TypeScript', 'API Integration', 'Redux', 'Architecture'],
  'BDA': ['Business Development', 'Lead Generation', 'Salesforce', 'CRM', 'Market Research', 'Proposals', 'Communication'],
  'BDM': ['Business Management', 'Sales Strategy', 'Partnerships', 'Client Relations', 'Revenue Growth', 'Negotiation'],
  'Sales': ['Sales', 'Negotiation', 'CRM', 'Cold Calling', 'Communication', 'Closing', 'Targets', 'Product Knowledge'],
  'General': ['Git', 'Communication', 'Teamwork', 'Agile', 'Leadership']
};

const parseResumeContent = (text) => {
  const categories = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL', 'HTML', 'CSS', 'Go', 'Rust'],
    frameworks: ['React', 'Angular', 'Vue', 'Next.js', 'Express', 'Node.js', 'Django', 'Flask', 'Spring', 'Redux'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'PostgreSQL', 'MongoDB', 'Redis', 'Jira']
  };

  const identifiedSkills = {
    languages: categories.languages.filter(s => new RegExp(`\\b${escapeRegExp(s)}\\b`, 'i').test(text)),
    frameworks: categories.frameworks.filter(s => new RegExp(`\\b${escapeRegExp(s)}\\b`, 'i').test(text)),
    tools: categories.tools.filter(s => new RegExp(`\\b${escapeRegExp(s)}\\b`, 'i').test(text))
  };

  const allFoundSkills = [...identifiedSkills.languages, ...identifiedSkills.frameworks, ...identifiedSkills.tools];

  const sections = {
    experience: /experience|work history|employment|career/i.test(text),
    education: /education|degree|university|college|academic/i.test(text),
    contact: /email|phone|contact|address|linkedin/i.test(text),
    projects: /projects|portfolio|personal work/i.test(text)
  };

  return {
    text,
    skills: identifiedSkills,
    allSkills: allFoundSkills,
    sections
  };
};

const analyzeResume = (parsedData, targetRole) => {
  const { skills, sections, text, allSkills } = parsedData;
  const wordCount = text.split(/\s+/).length;
  
  // Categorical Calculations
  let impactScore = 40;
  let presentationScore = 40;
  let skillMatchScore = 30;
  let brevityScore = 50;
  let styleScore = 50;
  let softSkillsScore = 20;

  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  // 1. Impact Analysis
  const actionVerbs = ['Lead', 'Developed', 'Managed', 'Increased', 'Decreased', 'Spearheaded', 'Optimized', 'Delivered', 'Built'];
  const foundVerbs = actionVerbs.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(text));
  impactScore += foundVerbs.length * 5;
  if (/\d+%|\d+m|\d+k|USD|INR/i.test(text)) {
    impactScore += 15;
    strengths.push("Uses quantifiable metrics to demonstrate impact");
  } else {
    weaknesses.push("Lacks measurable achievements");
    suggestions.push("Quantify your impact using numbers or percentages.");
  }
  impactScore = Math.min(impactScore, 100);

  // 2. Brevity Analysis
  if (wordCount >= 400 && wordCount <= 700) brevityScore = 90;
  else if (wordCount > 700 && wordCount < 1000) brevityScore = 70;
  else if (wordCount < 400) brevityScore = 40;
  else brevityScore = 30;
  
  if (brevityScore > 75) strengths.push("Optimal resume length and word density");
  else weaknesses.push(wordCount < 400 ? "Resume is too brief" : "Resume is too wordy");

  // 3. Style Analysis
  if (sections.experience) styleScore += 15;
  if (sections.education) styleScore += 10;
  if (sections.contact) styleScore += 10;
  if (sections.projects) styleScore += 15;
  
  const bulletPointCount = (text.match(/^[•\-\*]/gm) || []).length;
  if (bulletPointCount > 5) styleScore += 10;
  styleScore = Math.min(styleScore, 100);
  if (styleScore > 80) strengths.push("Strong professional formatting and structure");

  // 4. Soft Skills Analysis
    const softSkillKeywords = ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Adaptability', 'Management', 'Mentoring'];
    const foundSoftSkills = softSkillKeywords.filter(s => {
        try {
            return new RegExp(`\\b${escapeRegExp(s.trim())}\\b`, 'i').test(text);
        } catch (e) {
            return text.toLowerCase().includes(s.toLowerCase());
        }
    });
  softSkillsScore += foundSoftSkills.length * 12;
  softSkillsScore = Math.min(softSkillsScore, 100);
  if (foundSoftSkills.length > 3) strengths.push("Demonstrates key soft skills and leadership traits");

  // 3. Skill Match Analysis
  const targetKeywords = roleKeywords[targetRole] || roleKeywords['General'];
  const matchedKeywords = targetKeywords.filter(k => 
    new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(text)
  );
  
  skillMatchScore = targetKeywords.length > 0 
    ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) 
    : 70;

  if (skillMatchScore > 75) strengths.push(`Strong keyword alignment for ${targetRole} role`);
  else if (targetRole !== 'General') {
    weaknesses.push(`Keyword gap for ${targetRole} requirements`);
    suggestions.push(`Consider adding skills like: ${targetKeywords.slice(0, 3).join(', ')}`);
  }

  // Final Overall Score
  const finalScore = Math.round((impactScore + brevityScore + styleScore + softSkillsScore + skillMatchScore) / 5);

  // Rejection Risk & Drop Reasons
  let rejectionRisk = 'Low';
  const dropReasons = [];
  
  if (finalScore < 50) rejectionRisk = 'High';
  else if (finalScore < 75) rejectionRisk = 'Medium';
  
  // Define Potential Drop Reasons
  if (skillMatchScore < 50) {
    dropReasons.push({
      type: 'Lack of Relevant Skills',
      description: `Your resume does not include key skills like ${targetKeywords.slice(0, 2).join(' and ')} required for this role.`,
      fix: `Add core skills like ${targetKeywords.slice(0, 2).join(', ')} to your skills section.`
    });
  }
  
  if (impactScore < 60) {
    dropReasons.push({
      type: 'No Impact / Achievements',
      description: "You have mentioned work, but no measurable results (e.g., % improvement, numbers).",
      fix: "Add numbers like 'increased performance by 30%' or 'managed $5M budget'."
    });
  }
  
  if (styleScore < 60) {
    dropReasons.push({
      type: 'Poor First Impression',
      description: "Resume structure is not attractive or missing core sections, reducing recruiter interest.",
      fix: "Use a clean, standard professional layout with clear section headers."
    });
  }

  const smartInsight = finalScore < 70 
    ? `Your overall score is low mainly due to ${impactScore < skillMatchScore ? 'low impact' : 'missing keywords'} and limited measurable results.`
    : "Your resume has a strong foundation, but could be further optimized for competitive ATS filters.";

  return {
    score: finalScore,
    status: finalScore >= 80 ? 'Selected' : finalScore >= 60 ? 'Consider' : 'Rejected',
    matchPercentage: skillMatchScore,
    rejectionRisk,
    smartInsight,
    dropReasons: dropReasons.slice(0, 3),
    scoreBreakdown: {
      skills: skillMatchScore,
      experience: Math.min(100, softSkillsScore + 20),
      ats: styleScore,
      impact: impactScore
    },
    categories: {
      impact: impactScore,
      brevity: brevityScore,
      style: styleScore,
      softSkills: softSkillsScore,
      skills: skillMatchScore
    },
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 3),
    suggestions: suggestions.slice(0, 2),
    skillsByCategory: skills,
    relevantSkills: matchedKeywords,
    missingSkills: targetKeywords.filter(k => !matchedKeywords.some(m => new RegExp(`\\b${escapeRegExp(m)}\\b`, 'i').test(k))).map(s => ({
      name: s,
      neededFor: `Crucial for ${targetRole} technical assessment.`
    })),
    irrelevantSkills: allSkills.filter(s => !targetKeywords.some(k => {
      try {
        return new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(s);
      } catch (e) {
        return s.toLowerCase().includes(k.toLowerCase());
      }
    })),
    rejectionReasons: finalScore < 60 ? [
      matchedKeywords.length < 2 ? { type: "Technical GAP", desc: `Missing core ${targetRole} technologies.` } : null,
      !sections.experience ? { type: "Experience GAP", desc: "No hands-on project history found." } : null,
      impactScore < 50 ? { type: "Impact GAP", desc: "Vague descriptions without metrics." } : null,
      styleScore < 60 ? { type: "Layout ISSUE", desc: "Poor formatting found." } : null,
      softSkillsScore < 40 ? { type: "Communication GAP", desc: "Weak professional signal." } : null
    ].filter(Boolean) : [],
    howToImprove: finalScore < 60 ? [
      `Learn required technologies like ${targetKeywords.slice(0, 3).join(', ')} and build real-world projects`,
      "Add measurable achievements (e.g., improved performance by 30%)",
      "Improve resume structure using professional bullet points",
      `Add role-specific keywords for ${targetRole} to your profile`
    ] : [],
    finalVerdict: finalScore >= 80 ? `Candidate is highly suitable for the ${targetRole} role with strong alignment.` : 
                  finalScore >= 60 ? `Candidate is moderately suitable for the ${targetRole} role but lacks advanced experience.` :
                  `Candidate is not suitable for the ${targetRole} role due to lack of essential skills and practical experience.`
  };
};

module.exports = {
  extractTextFromPDF,
  extractTextFromDOCX,
  parseResumeContent,
  analyzeResume,
  roleKeywords
};
