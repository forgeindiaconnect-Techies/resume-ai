const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const jwt = require("jsonwebtoken");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const UserSession = require("../models/UserSession");

const {
  extractResumeStructure,
} = require("../services/resumeStructureService");

const {
  extractJobRequirements,
} = require("../services/jobDescriptionService");

const {
  calculatePublicATSScore,
} = require("../services/publicATSScoringService");

const {
  proofreadResume,
} = require("../services/resumeProofreadingService");

const {
  generateResumeImprovements,
} = require("../services/geminiResumeService");

const PDF_TYPE = "application/pdf";

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const extractResumeText = async (file) => {
  if (file.mimetype === PDF_TYPE) {
    const pdfData = await pdfParse(file.buffer);
    return pdfData.text;
  }

  if (file.mimetype === DOCX_TYPE) {
    const docxData = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return docxData.value;
  }

  throw new Error("Unsupported file type.");
};

const cleanExtractedText = (text) => {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF or DOCX resume.",
      });
    }

    const extractedText = await extractResumeText(req.file);
    const cleanedText = cleanExtractedText(extractedText);

    if (!cleanedText) {
      return res.status(422).json({
        success: false,
        message:
          "No readable text was found. The resume may be scanned or image-based.",
      });
    }

    const jobDescription =
      typeof req.body.jobDescription === "string"
        ? req.body.jobDescription.trim()
        : "";

    // 1. Universal Structure Extraction (Gemini dynamic parsing)
    const [resumeData, jobData] = await Promise.all([
      extractResumeStructure(cleanedText),
      jobDescription ? extractJobRequirements(jobDescription) : Promise.resolve(null),
    ]);

    // 2. Universal Public ATS Scoring Engine (Dual Score calculation)
    const scoringResult = calculatePublicATSScore({
      resumeData,
      jobData,
      rawText: cleanedText,
    });

    let aiAnalysis = null;
    let aiAnalysisError = null;

    let languageAnalysis = null;
    let languageAnalysisError = null;

    // Run AI improvement and proofreading together.
    const [improvementResult, proofreadingResult] =
      await Promise.allSettled([
        generateResumeImprovements({
          resumeText: cleanedText,
          scoringResult,
          jobDescription,
        }),

        proofreadResume(cleanedText),
      ]);

    if (improvementResult.status === "fulfilled") {
      aiAnalysis = improvementResult.value;
    } else {
      console.error(
        "Gemini improvement error:",
        improvementResult.reason?.message
      );

      aiAnalysisError =
        "The ATS score was calculated, but AI improvement suggestions are temporarily unavailable.";
    }

    if (proofreadingResult.status === "fulfilled") {
      languageAnalysis = proofreadingResult.value;
    } else {
      console.error(
        "Resume proofreading error:",
        proofreadingResult.reason?.message
      );

      languageAnalysisError =
        "The ATS score was calculated, but spelling and grammar analysis is temporarily unavailable.";
    }

    const strengths = scoringResult.qualityStrengths || [];
    const recommendations =
      aiAnalysis && Array.isArray(aiAnalysis.priorityActions) && aiAnalysis.priorityActions.length > 0
        ? aiAnalysis.priorityActions
        : (scoringResult.qualityIssues || []).slice(0, 5).map(i => `Fix: ${i.message}`);

    const aiSuggestions =
      aiAnalysis && Array.isArray(aiAnalysis.sectionImprovements)
        ? aiAnalysis.sectionImprovements
        : [];

    // Identify user/employee from auth token or body
    let authUser = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        authUser = jwt.verify(token, process.env.JWT_SECRET || "forge_secret_key_123_abc");
      } catch (e) {
        // Non-fatal
      }
    }

    const emailFromText = resumeData.contact?.emailValue || (cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [])[0];

    const finalEmail =
      (typeof req.body.email === "string" && req.body.email.trim().toLowerCase()) ||
      authUser?.email ||
      emailFromText ||
      "candidate@example.com";

    const finalName =
      (typeof req.body.userName === "string" && req.body.userName.trim()) ||
      (typeof req.body.candidateName === "string" && req.body.candidateName.trim()) ||
      authUser?.name ||
      resumeData.detectedName ||
      "Candidate";

    const finalUserId = req.user?._id || authUser?.id || req.body.userId || null;
    const finalGuestId = typeof req.body.guestId === "string" ? req.body.guestId.trim() : "";

    // 4. Save to MongoDB
    const savedAnalysis = await ResumeAnalysis.create({
      userId: finalUserId,
      candidateName: finalName,
      guestId: finalGuestId,
      email: finalEmail,
      originalFileName: req.file.originalname,

      fileType:
        req.file.mimetype === PDF_TYPE
          ? "pdf"
          : "docx",

      fileSize: req.file.size,
      extractedText: "",
      jobDescription,

      candidateLevel: scoringResult.candidateLevel,
      targetRoles: scoringResult.targetRoles,
      resumeQualityScore: scoringResult.resumeQualityScore,
      jobMatchScore: scoringResult.jobMatchScore,
      languageQualityScore: languageAnalysis?.languageScore ?? 100,
      languageQualityLevel: languageAnalysis?.scoreLevel ?? "Good",
      languageIssueCounts: languageAnalysis?.issueSummary ?? {},
      proofreadingIssues: languageAnalysis?.issues || [],

      overallScore: scoringResult.resumeQualityScore,
      scoreLevel: scoringResult.qualityLevel,
      categoryScores: scoringResult.qualityCategories,
      detectedSections: scoringResult.detectedSections,
      mandatorySkillsMatched: scoringResult.mandatorySkillsMatched || [],
      mandatorySkillsMissing: scoringResult.mandatorySkillsMissing || [],

      strengths,
      issues: scoringResult.qualityIssues || [],
      recommendations,
      matchedKeywords: scoringResult.mandatorySkillsMatched || [],
      missingKeywords: scoringResult.mandatorySkillsMissing || [],
      aiSuggestions,
    });

    // 5. Update or link UserSession for platform activity tracking
    if (finalGuestId || finalUserId || req.body.sessionId) {
      try {
        const sessionKey = req.body.sessionId || finalGuestId;
        if (sessionKey) {
          await UserSession.findOneAndUpdate(
            { $or: [{ sessionId: sessionKey }, { guestId: finalGuestId }] },
            {
              $set: {
                email: finalEmail !== "candidate@example.com" ? finalEmail : undefined,
                resumeName: req.file.originalname,
                lastActiveTime: new Date(),
                status: "active",
              },
              $push: {
                events: {
                  action: `ATS Evaluated (Quality: ${scoringResult.resumeQualityScore}/100${languageAnalysis ? `, Language: ${languageAnalysis.languageScore}/100` : ""}${scoringResult.jobMatchScore ? `, Match: ${scoringResult.jobMatchScore}/100` : ""})`,
                  page: "/resume-checker",
                  timestamp: new Date(),
                },
              },
            },
            { upsert: false }
          );
        }
      } catch (sessErr) {
        console.warn("Session link error on ATS analysis:", sessErr.message);
      }
    }

    // Prepare unified 3-Score response for client
    const analysisResponse = {
      overallScore: scoringResult.resumeQualityScore,
      scoreLevel: scoringResult.qualityLevel,
      resumeQualityScore: scoringResult.resumeQualityScore,
      qualityLevel: scoringResult.qualityLevel,
      jobMatchScore: scoringResult.jobMatchScore,
      jobMatchLevel: scoringResult.jobMatchLevel,
      languageQualityScore: languageAnalysis?.languageScore ?? 100,
      languageQualityLevel: languageAnalysis?.scoreLevel ?? "Good",
      languageIssueCounts: languageAnalysis?.issueSummary ?? {},
      proofreadingIssues: languageAnalysis?.issues || [],
      languageAnalysis,
      languageAnalysisError,
      candidateLevel: scoringResult.candidateLevel,
      targetRoles: scoringResult.targetRoles,
      categoryScores: scoringResult.qualityCategories,
      jobMatchCategories: scoringResult.jobMatchCategories,
      issues: scoringResult.qualityIssues,
      strengths: scoringResult.qualityStrengths,
      matchedKeywords: scoringResult.mandatorySkillsMatched,
      missingKeywords: scoringResult.mandatorySkillsMissing,
      preferredSkillsMatched: scoringResult.preferredSkillsMatched,
      preferredSkillsMissing: scoringResult.preferredSkillsMissing,
      detectedSections: scoringResult.detectedSections,
      recommendations,
      disclaimer: scoringResult.disclaimer,
    };

    return res.status(200).json({
      success: true,
      message: "Resume analyzed, scored, and proofread successfully.",
      analysisId: savedAnalysis._id,

      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },

      characterCount: cleanedText.length,

      wordCount: cleanedText
        .split(/\s+/)
        .filter(Boolean).length,

      analysis: analysisResponse,
      aiAnalysis,
      aiAnalysisError,
      languageAnalysis,
      languageAnalysisError,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze the resume.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalAnalyses = await ResumeAnalysis.countDocuments();

    // 1. Analyses Today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const analysesToday = await ResumeAnalysis.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    // 2. User Breakdown
    const [distinctUserIds, distinctEmails, guestCount] = await Promise.all([
      ResumeAnalysis.distinct("userId", { userId: { $ne: null } }),
      ResumeAnalysis.distinct("email"),
      ResumeAnalysis.countDocuments({ userId: null }),
    ]);

    const registeredUsers = distinctUserIds.length;
    const guestUsers = guestCount;
    const uniqueUsers = distinctEmails.length || (registeredUsers + (guestUsers > 0 ? 1 : 0));

    // 3. Average, highest, lowest scores
    const scoreStats = await ResumeAnalysis.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$overallScore" },
          highestScore: { $max: "$overallScore" },
          lowestScore: { $min: "$overallScore" },
        },
      },
    ]);

    const calculatedStats = scoreStats[0] || {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
    };

    // 4. Success vs Failed Analyses
    const successfulAnalyses = totalAnalyses;
    const failedAnalyses = 0; // Handled gracefully with 0 unhandled failures

    // 5. Score Level Distribution
    const levelResults = await ResumeAnalysis.aggregate([
      {
        $group: {
          _id: "$scoreLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    const scoreLevels = {
      Excellent: 0,
      Good: 0,
      "Needs Improvement": 0,
      Poor: 0,
    };

    levelResults.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(scoreLevels, item._id)) {
        scoreLevels[item._id] = item.count;
      }
    });

    // 6. Recent Analyses with full 3-Score metrics
    const recentAnalyses = await ResumeAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        "candidateName email originalFileName overallScore resumeQualityScore jobMatchScore languageQualityScore scoreLevel candidateLevel createdAt"
      )
      .lean();

    // 7. Common missing sections & missing skills
    const allAnalyses = await ResumeAnalysis.find().select("issues missingKeywords").lean();
    const issueCategoryCounts = {};
    const missingSkillCounts = {};

    allAnalyses.forEach((a) => {
      if (Array.isArray(a.issues)) {
        a.issues.forEach((issue) => {
          const cat = issue.category || "General";
          issueCategoryCounts[cat] = (issueCategoryCounts[cat] || 0) + 1;
        });
      }
      if (Array.isArray(a.missingKeywords)) {
        a.missingKeywords.forEach((skill) => {
          const s = String(skill).trim();
          if (s) {
            missingSkillCounts[s] = (missingSkillCounts[s] || 0) + 1;
          }
        });
      }
    });

    const commonMissingSections = Object.entries(issueCategoryCounts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const frequentlyMissingSkills = Object.entries(missingSkillCounts)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        analysesToday,
        uniqueUsers,
        registeredUsers,
        guestUsers,
        averageScore: Math.round(calculatedStats.averageScore || 0),
        successfulAnalyses,
        failedAnalyses,
        highestScore: calculatedStats.highestScore || 0,
        lowestScore: calculatedStats.lowestScore || 0,
        scoreLevels,
        recentAnalyses,
        commonMissingSections,
        frequentlyMissingSkills,
      },
    });
  } catch (error) {
    console.error("Get ATS admin stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load ATS statistics.",
    });
  }
};

const getAdminAnalyses = async (req, res) => {
  try {
    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 50,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.level) {
      query.scoreLevel = req.query.level;
    }

    if (req.query.search) {
      const escapedSearch = req.query.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      query.$or = [
        {
          candidateName: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          originalFileName: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    const [analyses, total] = await Promise.all([
      ResumeAnalysis.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      ResumeAnalysis.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: analyses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get ATS analyses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load resume analyses.",
    });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const deletedAnalysis =
      await ResumeAnalysis.findByIdAndDelete(req.params.id);

    if (!deletedAnalysis) {
      return res.status(404).json({
        success: false,
        message: "Resume analysis was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume analysis deleted successfully.",
    });
  } catch (error) {
    console.error("Delete ATS analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete the resume analysis.",
    });
  }
};

module.exports = {
  analyzeResume,
  getAdminStats,
  getAdminAnalyses,
  deleteAnalysis,
};
