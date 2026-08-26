const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    candidateName: {
      type: String,
      default: "",
    },
    guestId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: "pdf",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedText: {
      type: String,
      default: "",
    },
    jobDescription: {
      type: String,
      default: "",
    },
    candidateLevel: {
      type: String,
      default: "Fresher",
    },
    targetRoles: [
      {
        type: String,
      },
    ],
    resumeQualityScore: {
      type: Number,
      default: 0,
    },
    jobMatchScore: {
      type: Number,
      default: null,
    },
    languageQualityScore: {
      type: Number,
      default: 100,
    },
    languageQualityLevel: {
      type: String,
      default: "Good Quality",
    },
    languageIssueCounts: {
      type: Object,
      default: {},
    },
    proofreadingIssues: {
      type: Array,
      default: [],
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scoreLevel: {
      type: String,
      enum: ["Excellent", "Good", "Needs Improvement", "Poor"],
      required: true,
    },
    categoryScores: {
      type: Object,
      required: true,
    },
    detectedSections: {
      type: Object,
      default: {},
    },
    mandatorySkillsMatched: [
      {
        type: String,
      },
    ],
    mandatorySkillsMissing: [
      {
        type: String,
      },
    ],
    strengths: [
      {
        type: String,
      },
    ],
    issues: [
      {
        category: { type: String, required: true },
        message: { type: String, required: true },
        pointsLost: { type: Number, required: true },
      },
    ],
    recommendations: [
      {
        type: String,
      },
    ],
    matchedKeywords: [
      {
        type: String,
      },
    ],
    missingKeywords: [
      {
        type: String,
      },
    ],
    aiSuggestions: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
