const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toArray = (value) =>
  Array.isArray(value) ? value.filter(Boolean) : [];

const flattenToText = (values) =>
  normalize(
    toArray(values)
      .map((value) =>
        typeof value === "string"
          ? value
          : JSON.stringify(value)
      )
      .join(" ")
  );

const getResumeText = (resume) =>
  flattenToText([
    resume.summary,
    ...toArray(resume.skills),
    ...toArray(resume.experience),
    ...toArray(resume.projects),
    ...toArray(resume.education),
    ...toArray(resume.certifications),
    ...toArray(resume.achievements),
  ]);

const requirementMatches = (requirement, resumeText) => {
  const normalizedRequirement = normalize(requirement);

  if (!normalizedRequirement) {
    return false;
  }

  // Direct phrase match.
  if (resumeText.includes(normalizedRequirement)) {
    return true;
  }

  // Token-overlap match for longer requirements.
  const tokens = normalizedRequirement
    .split(" ")
    .filter((token) => token.length > 2);

  if (!tokens.length) {
    return false;
  }

  const matchedTokens = tokens.filter((token) =>
    resumeText.includes(token)
  );

  return matchedTokens.length / tokens.length >= 0.6;
};

const compareRequirements = (requirements, resumeText) => {
  const uniqueRequirements = [
    ...new Set(
      toArray(requirements)
        .map((item) => String(item).trim())
        .filter(Boolean)
    ),
  ];

  const matched = [];
  const missing = [];

  uniqueRequirements.forEach((requirement) => {
    if (requirementMatches(requirement, resumeText)) {
      matched.push(requirement);
    } else {
      missing.push(requirement);
    }
  });

  return {
    total: uniqueRequirements.length,
    matched,
    missing,
    ratio:
      uniqueRequirements.length > 0
        ? matched.length / uniqueRequirements.length
        : 0,
  };
};

const calculateJobMatchScore = ({
  resumeProfile,
  jobRequirements,
}) => {
  if (!jobRequirements) {
    return null;
  }

  const resumeText = getResumeText(resumeProfile);

  const mandatoryRequirements = [
    ...toArray(jobRequirements.mandatorySkills),
    ...toArray(jobRequirements.toolsAndTechnologies),
    ...toArray(jobRequirements.domainKnowledge),
    ...toArray(jobRequirements.languages),
    ...toArray(jobRequirements.otherMandatoryRequirements),
  ];

  const mandatory = compareRequirements(
    mandatoryRequirements,
    resumeText
  );

  const preferred = compareRequirements(
    jobRequirements.preferredSkills,
    resumeText
  );

  const responsibilities = compareRequirements(
    jobRequirements.responsibilities,
    resumeText
  );

  const education = compareRequirements(
    jobRequirements.educationRequirements,
    resumeText
  );

  const requiredYears = Number(
    jobRequirements.experience?.minimumYears
  );

  const candidateYears = Number(
    resumeProfile.totalExperienceYears
  );

  let experienceRatio = 0;
  let experienceApplicable = false;

  if (Number.isFinite(requiredYears) && requiredYears > 0) {
    experienceApplicable = true;

    if (Number.isFinite(candidateYears)) {
      experienceRatio = Math.min(
        1,
        candidateYears / requiredYears
      );
    }
  } else if (jobRequirements.experience?.description) {
    experienceApplicable = true;

    const experienceResult = compareRequirements(
      [jobRequirements.experience.description],
      resumeText
    );

    experienceRatio = experienceResult.ratio;
  }

  const categories = [
    {
      name: "Mandatory Requirements",
      maximum: 40,
      applicable: mandatory.total > 0,
      ratio: mandatory.ratio,
    },
    {
      name: "Relevant Experience",
      maximum: 25,
      applicable: experienceApplicable,
      ratio: experienceRatio,
    },
    {
      name: "Responsibilities",
      maximum: 15,
      applicable: responsibilities.total > 0,
      ratio: responsibilities.ratio,
    },
    {
      name: "Education",
      maximum: 10,
      applicable: education.total > 0,
      ratio: education.ratio,
    },
    {
      name: "Preferred Requirements",
      maximum: 10,
      applicable: preferred.total > 0,
      ratio: preferred.ratio,
    },
  ];

  const applicableCategories = categories.filter(
    (category) => category.applicable
  );

  const availablePoints = applicableCategories.reduce(
    (total, category) => total + category.maximum,
    0
  );

  const earnedPoints = applicableCategories.reduce(
    (total, category) =>
      total + category.maximum * category.ratio,
    0
  );

  const jobMatchScore =
    availablePoints > 0
      ? Math.round((earnedPoints / availablePoints) * 100)
      : 0;

  return {
    jobMatchScore,

    matchLevel:
      jobMatchScore >= 80
        ? "Strong Match"
        : jobMatchScore >= 60
          ? "Moderate Match"
          : jobMatchScore >= 40
            ? "Low Match"
            : "Poor Match",

    matchedMandatoryRequirements: mandatory.matched,
    missingMandatoryRequirements: mandatory.missing,

    matchedPreferredRequirements: preferred.matched,
    missingPreferredRequirements: preferred.missing,

    matchedResponsibilities: responsibilities.matched,
    missingResponsibilities: responsibilities.missing,

    matchedEducationRequirements: education.matched,
    missingEducationRequirements: education.missing,

    experience: {
      requiredYears:
        Number.isFinite(requiredYears)
          ? requiredYears
          : null,

      candidateYears:
        Number.isFinite(candidateYears)
          ? candidateYears
          : null,

      matchPercentage: Math.round(experienceRatio * 100),
    },

    categoryBreakdown: applicableCategories.map(
      (category) => ({
        category: category.name,
        score: Number(
          (category.maximum * category.ratio).toFixed(1)
        ),
        maximum: category.maximum,
      })
    ),

    disclaimer:
      "This estimated score compares the uploaded resume only with the job description provided by the user.",
  };
};

const calculateResumeQualityScore = ({ resumeData, rawText = "" }) => {
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

  // Parseability (10 pts)
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

  // Contact (10 pts)
  if (contact.namePresent) qualityCategories.contact.score += 2;
  else qualityCategories.contact.issues.push({ message: "Full candidate name is missing or unclear at the top.", pointsLost: 2 });

  if (contact.emailPresent) qualityCategories.contact.score += 2;
  else qualityCategories.contact.issues.push({ message: "Add a professional email address.", pointsLost: 2 });

  if (contact.phonePresent) qualityCategories.contact.score += 2;
  else qualityCategories.contact.issues.push({ message: "Add a valid mobile phone number.", pointsLost: 2 });

  if (contact.locationPresent) qualityCategories.contact.score += 2;
  else qualityCategories.contact.issues.push({ message: "Add your city, state, or country location.", pointsLost: 2 });

  if (contact.linkedinPresent || contact.portfolioPresent) {
    qualityCategories.contact.score += 2;
    qualityCategories.contact.strengths.push("Professional profile links (LinkedIn/Portfolio) are provided.");
  } else {
    qualityCategories.contact.issues.push({ message: "Add a LinkedIn profile or professional portfolio link.", pointsLost: 2 });
  }

  // Summary (10 pts)
  if (sections.summary || summary.present) {
    qualityCategories.summary.score += 4;
    if (summary.describesRole !== false) qualityCategories.summary.score += 3;
    else qualityCategories.summary.issues.push({ message: "State your target job title or primary area of expertise in the summary.", pointsLost: 3 });

    if (summary.hasClearValueProposition !== false) {
      qualityCategories.summary.score += 3;
      qualityCategories.summary.strengths.push("Summary effectively communicates core value and capabilities.");
    } else {
      qualityCategories.summary.issues.push({ message: "Highlight 2–3 key skills or achievements in your summary.", pointsLost: 3 });
    }
  } else {
    qualityCategories.summary.issues.push({ message: "Add a 3–4 sentence professional summary outlining your focus and strengths.", pointsLost: 10 });
  }

  // Experience / Exposure (20 pts)
  if (isFresher) {
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
    let expScore = 0;
    if (sections.experience || experienceList.length > 0) {
      expScore += 8;
      qualityCategories.experienceExposure.strengths.push("Work experience section clearly structured.");
    } else {
      qualityCategories.experienceExposure.issues.push({ message: "Add a dedicated Work Experience section with job titles and companies.", pointsLost: 8 });
    }

    if (experienceList.length >= 2) expScore += 4;
    else if (experienceList.length === 1) expScore += 2;

    if (experienceList.some((e) => e.hasQuantifiableMetrics)) {
      expScore += 8;
      qualityCategories.experienceExposure.strengths.push("Experience bullet points include quantifiable results and metrics.");
    } else {
      qualityCategories.experienceExposure.issues.push({ message: "Quantify achievements in your work history.", pointsLost: 8 });
    }
    qualityCategories.experienceExposure.score = Math.min(20, expScore);
  }

  // Education (10 pts)
  if (sections.education || educationList.length > 0) {
    qualityCategories.education.score += 6;
    if (educationList.some((e) => (typeof e === "string" && e.length > 0) || (e.degree && (e.institution || e.yearOrDuration)))) {
      qualityCategories.education.score += 4;
      qualityCategories.education.strengths.push("Education details are clearly stated.");
    } else {
      qualityCategories.education.issues.push({ message: "Ensure institution name, degree title, and graduation year are present.", pointsLost: 4 });
    }
  } else {
    qualityCategories.education.issues.push({ message: "Add an Education section specifying your degree or qualifications.", pointsLost: 10 });
  }

  // Skills (15 pts)
  if (sections.skills || skillsList.length > 0) {
    qualityCategories.skills.score += 5;
    if (skillsList.length >= 8) {
      qualityCategories.skills.score += 10;
      qualityCategories.skills.strengths.push(`Rich skill catalog detected (${skillsList.length} distinct competencies).`);
    } else if (skillsList.length >= 4) {
      qualityCategories.skills.score += 6;
      qualityCategories.skills.issues.push({ message: "Expand your skills list with more role-specific tools or competencies.", pointsLost: 4 });
    } else {
      qualityCategories.skills.issues.push({ message: "Add at least 6–10 industry-relevant skills.", pointsLost: 10 });
    }
  } else {
    qualityCategories.skills.issues.push({ message: "Add a dedicated Skills section for ATS keyword indexing.", pointsLost: 15 });
  }

  // Projects (10 pts)
  if (sections.projects || projectsList.length > 0 || certificationsList.length > 0) {
    qualityCategories.projects.score += 6;
    if (projectsList.some((p) => (p.toolsOrTech && p.toolsOrTech.length > 0) || typeof p === "string")) {
      qualityCategories.projects.score += 4;
      qualityCategories.projects.strengths.push("Projects highlight applied technical and practical capabilities.");
    } else {
      qualityCategories.projects.issues.push({ message: "Mention the specific tools or methodologies used in each project.", pointsLost: 4 });
    }
  } else {
    qualityCategories.projects.issues.push({ message: "Add a Projects or Key Achievements section.", pointsLost: 10 });
  }

  // Content Quality (10 pts)
  const verbCount = contentQuality.actionVerbsUsedCount || 0;
  if (verbCount >= 6) {
    qualityCategories.contentQuality.score += 5;
    qualityCategories.contentQuality.strengths.push("Strong action verbs utilized across descriptions.");
  } else if (verbCount >= 3) {
    qualityCategories.contentQuality.score += 3;
    qualityCategories.contentQuality.issues.push({ message: "Begin more bullet points with strong action verbs.", pointsLost: 2 });
  } else {
    qualityCategories.contentQuality.issues.push({ message: "Use compelling action verbs rather than passive phrases.", pointsLost: 5 });
  }

  if (!contentQuality.hasSpellingOrGrammarCues) {
    qualityCategories.contentQuality.score += 5;
  } else {
    qualityCategories.contentQuality.issues.push({ message: "Review text for minor typos or formatting inconsistencies.", pointsLost: 5 });
  }

  // Formatting (5 pts)
  if (!formatting.hasExcessiveSpecialSymbols) {
    qualityCategories.formatting.score += 5;
  } else {
    qualityCategories.formatting.issues.push({ message: "Avoid complex graphical icons or non-standard characters.", pointsLost: 5 });
  }

  let totalEarned = 0;
  let totalAvailable = 0;
  Object.values(qualityCategories).forEach((c) => {
    totalEarned += c.score;
    totalAvailable += c.maximum;
  });

  const resumeQualityScore = Math.round((totalEarned / totalAvailable) * 100);

  const qualityLevel =
    resumeQualityScore >= 90
      ? "Excellent"
      : resumeQualityScore >= 75
      ? "Good"
      : resumeQualityScore >= 60
      ? "Needs Improvement"
      : "Poor";

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

  return {
    candidateLevel: isFresher ? "Fresher" : "Experienced Professional",
    targetRoles: resumeData.targetRoles || [],
    detectedName: resumeData.detectedName || "",
    resumeQualityScore,
    qualityLevel,
    qualityCategories,
    qualityIssues: qualityIssues.sort((a, b) => b.pointsLost - a.pointsLost),
    qualityStrengths,
    detectedSections: sections,
    skillsDetected: skillsList,
  };
};

const calculatePublicATSScore = ({ resumeData, jobData = null, rawText = "" }) => {
  const quality = calculateResumeQualityScore({ resumeData, rawText });

  const jobMatch = jobData
    ? calculateJobMatchScore({
        resumeProfile: {
          ...resumeData,
          rawText,
        },
        jobRequirements: jobData,
      })
    : null;

  return {
    ...quality,
    jobMatchScore: jobMatch ? jobMatch.jobMatchScore : null,
    jobMatchLevel: jobMatch ? jobMatch.matchLevel : null,
    jobMatchCategories: jobMatch
      ? (jobMatch.categoryBreakdown || []).reduce((acc, c) => {
          acc[c.category] = { score: c.score, maximum: c.maximum, name: c.category };
          return acc;
        }, {})
      : null,
    matchedRequirements: jobMatch
      ? [
          ...(jobMatch.matchedMandatoryRequirements || []),
          ...(jobMatch.matchedPreferredRequirements || []),
        ]
      : [],
    missingMandatoryRequirements: jobMatch ? jobMatch.missingMandatoryRequirements || [] : [],
    missingPreferredRequirements: jobMatch ? jobMatch.missingPreferredRequirements || [] : [],
    explanation: jobMatch
      ? [
          ...(jobMatch.matchedMandatoryRequirements || []).map((m) => `${m} was found in the resume.`),
          ...(jobMatch.matchedPreferredRequirements || []).map((m) => `${m} (preferred) was found in the resume.`),
          ...(jobMatch.missingMandatoryRequirements || []).map((m) => `${m} was not found.`),
          ...(jobMatch.missingPreferredRequirements || []).map((m) => `${m} (preferred) was not found.`),
        ]
      : [],
    mandatorySkillsMatched: jobMatch ? jobMatch.matchedMandatoryRequirements || [] : [],
    mandatorySkillsMissing: jobMatch ? jobMatch.missingMandatoryRequirements || [] : [],
    preferredSkillsMatched: jobMatch ? jobMatch.matchedPreferredRequirements || [] : [],
    preferredSkillsMissing: jobMatch ? jobMatch.missingPreferredRequirements || [] : [],
    categoryBreakdown: jobMatch ? jobMatch.categoryBreakdown : [],
    jobMatchDetails: jobMatch,
    disclaimer: "Add missing skills only if you genuinely possess them. ATS scores are objective estimates.",
  };
};

module.exports = {
  calculateJobMatchScore,
  calculateResumeQualityScore,
  calculatePublicATSScore,
};
