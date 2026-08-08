export const RESUME_PRICING = {
  create: {
    id: "create",
    name: "Create Resume",
    description: "Build your resume manually",
    price: 49,
    currency: "INR",
    features: [
      "High-quality PDF",
      "No watermark",
      "Instant download",
      "Unlimited edits"
    ]
  },

  ai: {
    id: "ai",
    name: "AI Resume",
    description: "Generate a professional resume with AI",
    price: 99,
    currency: "INR",
    features: [
      "AI-generated summary",
      "AI-enhanced experience",
      "Job-specific skills",
      "Professional formatting",
      "PDF download",
      "No watermark"
    ]
  },

  template: {
    id: "template",
    name: "Premium Resume Template",
    description: "Start from a professional resume example",
    price: 79,
    currency: "INR",
    features: [
      "Premium template",
      "Fully editable content",
      "Professional formatting",
      "PDF download",
      "No watermark"
    ]
  }
};

export const getResumePrice = (source) => {
  return RESUME_PRICING[source]?.price || 0;
};
