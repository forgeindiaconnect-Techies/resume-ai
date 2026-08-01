import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
};

export const extractTextFromDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const parseResumeContent = (text) => {
  // Simple keyword-based extraction for demo
  const skillsList = [
    'React', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++', 'CSS', 'HTML', 
    'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Angular', 
    'Vue', 'Next.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redux', 'Git',
    'Agile', 'Scrum', 'Backend', 'Frontend', 'Fullstack', 'DevOps', 'Cloud'
  ];
  
  const foundSkills = skillsList.filter(skill => 
    new RegExp(`\\b${skill}\\b`, 'i').test(text)
  );

  // Detect sections
  const sections = {
    experience: /experience|work history|employment/i.test(text),
    education: /education|degree|university|college/i.test(text),
    contact: /email|phone|contact|address/i.test(text),
  };

  return {
    text,
    skills: foundSkills,
    sections
  };
};

export const analyzeResume = (parsedData, targetRole) => {
  const { skills, sections, text } = parsedData;
  const wordCount = text.split(/\s+/).length;
  
  let score = 50; // Base score
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];
  
  // 1. Technical Skills Analysis
  if (skills.length > 5) {
    score += 15;
    strengths.push(`Excellent technical skill coverage (${skills.length} key skills identified)`);
  } else if (skills.length > 2) {
    score += 5;
    strengths.push("Good core technical skills identified");
  } else {
    weaknesses.push("Limited technical keywords found");
    suggestions.push("Add more industry-relevant technical skills to your resume");
  }

  // 2. Section Analysis
  if (sections.experience) {
    score += 10;
  } else {
    weaknesses.push("Missing a clear 'Experience' section");
    suggestions.push("Ensure your work history is clearly labeled as 'Experience'");
  }

  if (sections.education) {
    score += 5;
  } else {
    weaknesses.push("Education details seem missing or unclear");
    suggestions.push("Add your educational background clearly");
  }

  if (!sections.contact) {
    weaknesses.push("Contact information might be missing");
    suggestions.push("Include your email, LinkedIn, and phone number explicitly");
  }

  // 3. Length/Clarity Analysis (Simulated)
  if (wordCount > 300 && wordCount < 1000) {
    score += 10;
    strengths.push("Resume length is optimal for readability");
  } else if (wordCount <= 300) {
    score -= 5;
    weaknesses.push("Resume is very brief");
    suggestions.push("Expand on your project details and responsibilities");
  } else {
    weaknesses.push("Resume might be too long/wordy");
    suggestions.push("Try to condense your experience into high-impact bullet points");
  }

  // 4. Role Matching (Simulated)
  const roleKeywords = {
    'Frontend Developer': ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript', 'Frontend'],
    'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'NoSQL', 'Backend', 'API'],
    'Data Scientist': ['Python', 'SQL', 'Data', 'Statistics', 'Machine Learning'],
    'Product Manager': ['Product', 'Agile', 'Scrum', 'Strategy', 'Roadmap'],
  };

  const targetKeywords = roleKeywords[targetRole] || [];
  const matchedKeywords = targetKeywords.filter(k => 
    new RegExp(`\\b${k}\\b`, 'i').test(text)
  );

  const matchPercentage = targetKeywords.length > 0 
    ? Math.round((matchedKeywords.length / targetKeywords.length) * 100)
    : 70; // Default match for 'General'

  if (matchPercentage > 80) {
    strengths.push(`Strong alignment with ${targetRole} requirements`);
  } else if (matchPercentage < 50 && targetRole !== 'General') {
    weaknesses.push(`Low keyword match for ${targetRole} role`);
    suggestions.push(`Integrate more ${targetRole}-specific terms like ${targetKeywords.slice(0, 3).join(', ')}`);
  }

  // Grammar/Action verbs check (Simulated)
  const actionVerbs = ['Improved', 'Developed', 'Lead', 'Created', 'Managed', 'Increased', 'Reduced'];
  const foundVerbs = actionVerbs.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(text));
  
  if (foundVerbs.length < 3) {
    weaknesses.push("Lack of quantifiable action verbs");
    suggestions.push("Use more action verbs like 'Quantified', 'Optimized', or 'Managed'");
  } else {
    strengths.push("Good use of action-oriented language");
  }

  return {
    score: Math.min(score, 100),
    matchPercentage,
    strengths,
    weaknesses,
    suggestions: suggestions.length > 0 ? suggestions : ["Your resume looks great! Consider tailor-fitting it for every job application."],
    keywords: skills.slice(0, 8)
  };
};
