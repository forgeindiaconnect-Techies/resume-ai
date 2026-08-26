/**
 * Universal Public ATS Scoring Engine
 * Dual-Score Architecture:
 * 1. Resume Quality Score (100 pts) - Evaluates structure & quality independently.
 * 2. Job Match Score (100 pts) - Evaluates match against a specific Job Description.
 */

const calculatePublicATSScore = ({ resumeData, jobData = null, rawText = "" }) => {
  const isFresher = (resumeData.candidateLevel || "fresher").toLowerCase() === "fresher";
  const contact = resumeData.contact || {};
  const sections = resumeData.sectionsDetected || {};
  const summary = resumeData.professionalSummary || {};
  const skillsList = resumeData.skills || [];
  const experienceList = resumeData.experience || [];
  const projectsList = resumeData.projects || [];
  const educationList = resumeData.education || [];
  const certificationsList = resumeData.certifications || [];
  const contentQuality = resumeData.contentQuality || {};
  const formatting = resumeData.formattingObservations || {};

  // =========================================================================
  // 1. RESUME QUALITY SCORE (100 Points Total)
  // =========================================================================
  const qualityCategories = {
    parseability: { score: 0, maximum: 10, name: "ATS Parseability", icon: "📐", issues: [], strengths: [] },
    contact: { score: 0, maximum: 10, name: "Contact Information", icon: "👤", issues: [], strengths: [] },
    summary: { score: 0, maximum: 10, name: "Professional Summary", icon: "📝", issues: [], strengths: [] },
    experienceExposure: { score: 0, maximum: 20, name: isFresher ? "Practical Exposure & Projects" : "Work Experience & History", icon: "💼", issues: [], strengths: [] },
    education: { score: 0, maximum: 10, name: "Education & Qualifications", icon: "🎓", issues: [], strengths: [] },
    skills: { score: 0, maximum: 15, name: "Skills Presentation", icon: "⚡", issues: [], strengths: [] },
    projects: { score: 0, maximum: 10, name: "Projects & Impact", icon: "🚀", issues: [], strengths: [] },
    contentQuality: { score: 0, maximum: 10, name: "Content Quality & Verbs", icon: "💎", issues: [], strengths: [] },
    formatting: { score: 0, maximum: 5, name: "Formatting & Structure", icon: "📄", issues: [], strengths: [] },
  };

  // --- Parseability (10 pts) ---
  if (rawText && rawText.length > 100) {
    qualityCategories.parseability.score += 5;
  } else {
    qualityCategories.parseability.issues.push({ message: "The document contains very little extractable text.", pointsLost: 5 });
  }
  if (formatting.hasCleanStructure !== false) {
    qualityCategories.parseability.score += 5;
    qualityCategories.parseability.strengths.push("Document text structure parses cleanly for automated ATS readers.");
  } else {
    qualityCategories.parseability.issues.push({ message: "Complex layout or text layering may hinder automated ATS parsers.", pointsLost: 5 });
  }

  // --- Contact Information (10 pts) ---
  if (contact.namePresent) {
    qualityCategories.contact.score += 2;
  } else {
    qualityCategories.contact.issues.push({ message: "Full candidate name is missing or unclear at the top.", pointsLost: 2 });
  }

  if (contact.emailPresent) {
    qualityCategories.contact.score += 2;
  } else {
    qualityCategories.contact.issues.push({ message: "Add a professional email address.", pointsLost: 2 });
  }

  if (contact.phonePresent) {
    qualityCategories.contact.score += 2;
  } else {
    qualityCategories.contact.issues.push({ message: "Add a valid mobile phone number.", pointsLost: 2 });
  }

  if (contact.locationPresent) {
    qualityCategories.contact.score += 2;
  } else {
    qualityCategories.contact.issues.push({ message: "Add your city, state, or country location.", pointsLost: 2 });
  }

  if (contact.linkedinPresent || contact.portfolioPresent) {
    qualityCategories.contact.score += 2;
    qualityCategories.contact.strengths.push("Professional profile links (LinkedIn/Portfolio) are provided.");
  } else {
    qualityCategories.contact.issues.push({ message: "Add a LinkedIn profile or professional portfolio link.", pointsLost: 2 });
  }

  // --- Professional Summary (10 pts) ---
  if (sections.summary || summary.present) {
    qualityCategories.summary.score += 4;
    if (summary.describesRole !== false) {
      qualityCategories.summary.score += 3;
    } else {
      qualityCategories.summary.issues.push({ message: "State your target job title or primary area of expertise in the summary.", pointsLost: 3 });
    }
    if (summary.hasClearValueProposition !== false) {
      qualityCategories.summary.score += 3;
      qualityCategories.summary.strengths.push("Summary effectively communicates core value and capabilities.");
    } else {
      qualityCategories.summary.issues.push({ message: "Highlight 2–3 key skills or achievements in your summary.", pointsLost: 3 });
    }
  } else {
    qualityCategories.summary.issues.push({ message: "Add a 3–4 sentence professional summary outlining your focus and strengths.", pointsLost: 10 });
  }

  // --- Experience or Practical Exposure (20 pts) ---
  if (isFresher) {
    // For freshers, practical exposure includes academic projects, internships, training, freelance work
    let exposureScore = 0;
    if (projectsList.length > 0 || sections.projects) {
      exposureScore += 10;
      qualityCategories.experienceExposure.strengths.push("Practical academic/personal projects are highlighted.");
    } else {
      qualityCategories.experienceExposure.issues.push({ message: "Add 1–2 practical projects or case studies to demonstrate hands-on capability.", pointsLost: 10 });
    }

    if (experienceList.length > 0 || sections.experience) {
      exposureScore += 6;
      qualityCategories.experienceExposure.strengths.push("Internship or work exposure included.");
    } else if (certificationsList.length > 0 || sections.certifications) {
      exposureScore += 6;
      qualityCategories.experienceExposure.strengths.push("Relevant coursework and certifications reinforce foundational knowledge.");
    } else {
      qualityCategories.experienceExposure.issues.push({ message: "Include any internships, training programs, or verified coursework.", pointsLost: 6 });
    }

    if (projectsList.some((p) => p.hasMeasurableOutcomes) || experienceList.some((e) => e.hasQuantifiableMetrics)) {
      exposureScore += 4;
    } else {
      qualityCategories.experienceExposure.issues.push({ message: "Include outcomes, user impact, or metrics in your project descriptions.", pointsLost: 4 });
    }
    qualityCategories.experienceExposure.score = Math.min(20, exposureScore);
  } else {
    // For experienced candidates, evaluate employment history, progression, and impact
    let expScore = 0;
    if (sections.experience || experienceList.length > 0) {
      expScore += 8;
      qualityCategories.experienceExposure.strengths.push("Work experience section clearly structured.");
    } else {
      qualityCategories.experienceExposure.issues.push({ message: "Add a dedicated Work Experience section with job titles and companies.", pointsLost: 8 });
    }

    if (experienceList.length >= 2) {
      expScore += 4;
    } else if (experienceList.length === 1) {
      expScore += 2;
    }

    const hasMetrics = experienceList.some((e) => e.hasQuantifiableMetrics);
    if (hasMetrics) {
      expScore += 8;
      qualityCategories.experienceExposure.strengths.push("Experience bullet points include quantifiable results and metrics.");
    } else {
      qualityCategories.experienceExposure.issues.push({ message: "Quantify achievements (e.g. '% improved', '$ saved', 'team size', 'time reduced') in your work history.", pointsLost: 8 });
    }
    qualityCategories.experienceExposure.score = Math.min(20, expScore);
  }

  // --- Education (10 pts) ---
  if (sections.education || educationList.length > 0) {
    qualityCategories.education.score += 6;
    const hasDetails = educationList.some((e) => e.degree && (e.institution || e.yearOrDuration));
    if (hasDetails) {
      qualityCategories.education.score += 4;
      qualityCategories.education.strengths.push("Education details (degree, institution, dates) are clearly stated.");
    } else {
      qualityCategories.education.issues.push({ message: "Ensure institution name, degree title, and graduation year are present.", pointsLost: 4 });
    }
  } else {
    qualityCategories.education.issues.push({ message: "Add an Education section specifying your degree or relevant certifications.", pointsLost: 10 });
  }

  // --- Skills Presentation (15 pts) ---
  if (sections.skills || skillsList.length > 0) {
    qualityCategories.skills.score += 5;
    if (skillsList.length >= 8) {
      qualityCategories.skills.score += 10;
      qualityCategories.skills.strengths.push(`Rich skill catalog detected (${skillsList.length} distinct competencies).`);
    } else if (skillsList.length >= 4) {
      qualityCategories.skills.score += 6;
      qualityCategories.skills.issues.push({ message: "Expand your skills list with more role-specific tools, frameworks, or domain competencies.", pointsLost: 4 });
    } else {
      qualityCategories.skills.issues.push({ message: "Add at least 6–10 industry-relevant skills.", pointsLost: 10 });
    }
  } else {
    qualityCategories.skills.issues.push({ message: "Add a dedicated Skills section to optimize for ATS keyword indexing.", pointsLost: 15 });
  }

  // --- Projects / Achievements (10 pts) ---
  if (sections.projects || projectsList.length > 0 || certificationsList.length > 0) {
    qualityCategories.projects.score += 6;
    if (projectsList.some((p) => p.toolsOrTech && p.toolsOrTech.length > 0)) {
      qualityCategories.projects.score += 4;
      qualityCategories.projects.strengths.push("Tools and technologies are explicitly associated with projects.");
    } else {
      qualityCategories.projects.issues.push({ message: "Mention the specific tools, methodologies, or technologies used in each project.", pointsLost: 4 });
    }
  } else {
    qualityCategories.projects.issues.push({ message: "Add a Projects or Key Achievements section.", pointsLost: 10 });
  }

  // --- Content Quality (10 pts) ---
  const verbCount = contentQuality.actionVerbsUsedCount || 0;
  if (verbCount >= 6) {
    qualityCategories.contentQuality.score += 5;
    qualityCategories.contentQuality.strengths.push("Strong action verbs utilized across descriptions.");
  } else if (verbCount >= 3) {
    qualityCategories.contentQuality.score += 3;
    qualityCategories.contentQuality.issues.push({ message: "Begin more bullet points with strong action verbs (e.g., Developed, Orchestrated, Optimized).", pointsLost: 2 });
  } else {
    qualityCategories.contentQuality.issues.push({ message: "Use compelling action verbs rather than passive phrases.", pointsLost: 5 });
  }

  if (!contentQuality.hasSpellingOrGrammarCues) {
    qualityCategories.contentQuality.score += 5;
  } else {
    qualityCategories.contentQuality.issues.push({ message: "Review text for minor typos or formatting inconsistencies.", pointsLost: 5 });
  }

  // --- Formatting (5 pts) ---
  if (!formatting.hasExcessiveSpecialSymbols) {
    qualityCategories.formatting.score += 5;
  } else {
    qualityCategories.formatting.issues.push({ message: "Avoid complex graphical icons, rating bars, or non-standard characters.", pointsLost: 5 });
  }

  // Aggregate Resume Quality
  let totalQualityEarned = 0;
  let totalQualityAvailable = 0;
  Object.values(qualityCategories).forEach((c) => {
    totalQualityEarned += c.score;
    totalQualityAvailable += c.maximum;
  });

  const resumeQualityScore = Math.round((totalQualityEarned / totalQualityAvailable) * 100);

  const qualityLevel =
    resumeQualityScore >= 90
      ? "Excellent"
      : resumeQualityScore >= 75
      ? "Good"
      : resumeQualityScore >= 60
      ? "Needs Improvement"
      : "Poor";

  // Aggregate Quality Issues & Strengths
  const qualityIssues = [];
  const qualityStrengths = [];
  Object.entries(qualityCategories).forEach(([categoryKey, cat]) => {
    cat.issues.forEach((iss) => {
      qualityIssues.push({ category: categoryKey, categoryName: cat.name, ...iss });
    });
    cat.strengths.forEach((str) => {
      qualityStrengths.push(typeof str === "string" ? str : str.message);
    });
  });

  // =========================================================================
  // 2. JOB MATCH SCORE (100 Points Total - only if JD is provided)
  // =========================================================================
  let jobMatchScore = null;
  let jobMatchLevel = null;
  let jobMatchCategories = null;
  let mandatorySkillsMatched = [];
  let mandatorySkillsMissing = [];
  let preferredSkillsMatched = [];
  let preferredSkillsMissing = [];

  if (jobData && (jobData.mandatorySkills?.length > 0 || jobData.preferredSkills?.length > 0 || jobData.jobTitle)) {
    jobMatchCategories = {
      mandatory: { score: 0, maximum: 30, name: "Mandatory Requirements" },
      requiredSkills: { score: 0, maximum: 25, name: "Required Skills" },
      responsibilities: { score: 0, maximum: 15, name: "Responsibilities Alignment" },
      experienceLevel: { score: 0, maximum: 15, name: "Experience Level Match" },
      education: { score: 0, maximum: 10, name: "Education / Certifications" },
      preferred: { score: 0, maximum: 5, name: "Preferred Requirements" },
    };

    const resumeAllText = (
      rawText +
      " " +
      skillsList.map((s) => (typeof s === "string" ? s : s.name)).join(" ") +
      " " +
      experienceList.map((e) => `${e.title} ${e.company} ${(e.responsibilities || []).join(" ")}`).join(" ") +
      " " +
      projectsList.map((p) => `${p.title} ${p.description} ${(p.toolsOrTech || []).join(" ")}`).join(" ")
    ).toLowerCase();

    // Match mandatory skills
    const mandatory = jobData.mandatorySkills || [];
    mandatory.forEach((skill) => {
      const cleanSkill = skill.toLowerCase().trim();
      if (resumeAllText.includes(cleanSkill)) {
        mandatorySkillsMatched.push(skill);
      } else {
        mandatorySkillsMissing.push(skill);
      }
    });

    if (mandatory.length > 0) {
      const ratio = mandatorySkillsMatched.length / mandatory.length;
      jobMatchCategories.mandatory.score = Math.round(ratio * 30);
      jobMatchCategories.requiredSkills.score = Math.round(ratio * 25);
    } else {
      jobMatchCategories.mandatory.score = 25;
      jobMatchCategories.requiredSkills.score = 20;
    }

    // Preferred skills
    const preferred = jobData.preferredSkills || [];
    preferred.forEach((skill) => {
      const cleanSkill = skill.toLowerCase().trim();
      if (resumeAllText.includes(cleanSkill)) {
        preferredSkillsMatched.push(skill);
      } else {
        preferredSkillsMissing.push(skill);
      }
    });

    if (preferred.length > 0) {
      const ratio = preferredSkillsMatched.length / preferred.length;
      jobMatchCategories.preferred.score = Math.round(ratio * 5);
    } else {
      jobMatchCategories.preferred.score = 5;
    }

    // Responsibilities match
    const respList = jobData.keyResponsibilities || [];
    let respMatched = 0;
    respList.forEach((r) => {
      const words = r.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      if (words.some((w) => resumeAllText.includes(w))) {
        respMatched++;
      }
    });
    if (respList.length > 0) {
      jobMatchCategories.responsibilities.score = Math.round((respMatched / respList.length) * 15);
    } else {
      jobMatchCategories.responsibilities.score = 12;
    }

    // Experience Level match
    const reqLevel = (jobData.experienceLevelRequired || "any").toLowerCase();
    if (reqLevel === "any" || reqLevel === (resumeData.candidateLevel || "fresher").toLowerCase()) {
      jobMatchCategories.experienceLevel.score = 15;
    } else if (reqLevel === "fresher" && !isFresher) {
      jobMatchCategories.experienceLevel.score = 15; // experienced applying to fresher role is capable
    } else {
      jobMatchCategories.experienceLevel.score = 8;
    }

    // Education match
    jobMatchCategories.education.score = educationList.length > 0 ? 10 : 5;

    let totalJobEarned = 0;
    let totalJobAvailable = 0;
    Object.values(jobMatchCategories).forEach((c) => {
      totalJobEarned += c.score;
      totalJobAvailable += c.maximum;
    });

    jobMatchScore = Math.round((totalJobEarned / totalJobAvailable) * 100);

    jobMatchLevel =
      jobMatchScore >= 85
        ? "Strong Match"
        : jobMatchScore >= 70
        ? "Good Match"
        : jobMatchScore >= 50
        ? "Moderate Match"
        : "Low Match";
  }

  return {
    candidateLevel: isFresher ? "Fresher" : "Experienced Professional",
    targetRoles: resumeData.targetRoles || [],
    detectedName: resumeData.detectedName || "",
    
    // 1. Resume Quality
    resumeQualityScore,
    qualityLevel,
    qualityCategories,
    qualityIssues: qualityIssues.sort((a, b) => b.pointsLost - a.pointsLost),
    qualityStrengths,

    // 2. Job Match
    jobMatchScore,
    jobMatchLevel,
    jobMatchCategories,
    mandatorySkillsMatched,
    mandatorySkillsMissing,
    preferredSkillsMatched,
    preferredSkillsMissing,

    // Metadata
    detectedSections: resumeData.sectionsDetected || {},
    skillsDetected: skillsList,
    disclaimer: "Add missing skills only if you genuinely possess them. ATS scores are objective estimates.",
  };
};

module.exports = {
  calculatePublicATSScore,
};
