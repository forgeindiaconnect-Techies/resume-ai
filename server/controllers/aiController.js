const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let aiClient = null;

if (GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    console.log("Gemini AI Engine Initialized ✅");
  } catch (error) {
    console.error(
      "Failed to initialize Gemini AI Client:",
      error.message
    );
  }
}

// Local Fallbacks (for when GEMINI_API_KEY is not set)
const localSummaries = {
  'Frontend': [
    "Dedicated and detail-oriented Frontend Developer with 4+ years of experience crafting beautiful, responsive user interfaces. Proven track record of optimizing rendering performance, reducing TTI, and increasing customer satisfaction by delivering pixel-perfect React solutions.",
    "Result-driven Frontend Specialist specialized in React, TypeScript, and modern state management. Passionate about translating complex Figma designs into high-quality, reusable components with strict adherence to accessibility standards."
  ],
  'Backend': [
    "Senior Backend Engineer with a strong foundation in distributed systems, microservices design, and API engineering. Expert in Node.js, databases indexing, and high-concurrency architectures, delivering server infrastructures with 99.9% uptime.",
    "Efficient Backend Developer experienced in Express, SQL/NoSQL databases, and cloud operations. Dedicated to engineering robust database designs and securing user authentication endpoints with optimized response latency."
  ],
  'Fullstack': [
    "Versatile Fullstack Developer with deep expertise in MERN stack. Proficient in handling complete product lifecycles, from schema modeling and protected JWT authentication to interactive, animated front-end React components.",
    "Passionate Software Engineer skilled in both client and server architectures. Expert in bridging user experience with server scalability, implementing robust databases, and optimizing cross-origin API request-response times."
  ],
  'Sales': [
    "High-performing Sales professional with a proven record of exceeding B2B target quotas. Skilled in lead generation, strategic negotiation, and managing client relations via standard CRM platforms.",
    "Business Development Specialist dedicated to driving organizational growth. Experienced in market expansion, B2B sales pipelines, and leading client presentations to secure strategic partnerships."
  ],
  'General': [
    "Professional Software Engineer with a passion for clean code, solid architectures, and modular systems. Adaptable learner focused on delivering user value through agile methodologies and collaborative teamwork.",
    "Results-oriented specialist with excellent communication and problem-solving skills. Dedicated to continuous professional development and exceeding technical benchmarks in collaborative sprint operations."
  ]
};

const localProjects = {
  'Frontend': [
    "Spearheaded the optimization of the central analytics dashboard using React Hooks and memoization techniques, resulting in a 40% decrease in Page Load latency and a 15% increase in user retention.",
    "Architected and deployed a reusable CSS/Tailwind design system, streamlining frontend development across 3 product lines and decreasing time-to-market by 25%."
  ],
  'Backend': [
    "Designed and engineered a high-throughput transaction backend using Express and MongoDB indexing, raising request handling capacity by 150% and securing endpoints with robust JWT verification.",
    "Developed a clean, automated background worker pool using Celery/Redis, offloading heavy report exports and improving server responsiveness by 30%."
  ],
  'Fullstack': [
    "Built and deployed an industry-grade SaaS platform from scratch, integrating secure Stripe checkout, email triggers, and a real-time live preview panel, generating $10k MRR within 6 months.",
    "Integrated complete MERN-stack resume builder, implementing JWT authentication, custom template color palettes, and standard database schemas with absolute cross-origin safety."
  ],
  'General': [
    "Pioneered the redesign of the core system architecture, resolving key performance bottlenecks and improving overall platform stability by 50%.",
    "Collaborated with cross-functional teams using Agile sprints to deliver modular, high-quality deliverables ahead of schedule, raising team sprint completion rate by 20%."
  ]
};

const localSkills = {
  'Frontend': ['React.js', 'TypeScript', 'JavaScript (ES6+)', 'Redux Toolkit', 'Tailwind CSS', 'Vite', 'Framer Motion', 'REST APIs', 'Unit Testing'],
  'Backend': ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'JWT Authentication', 'Redis', 'Docker', 'RESTful API Design', 'System Architecture'],
  'Fullstack': ['MERN Stack', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'Docker', 'AWS', 'Git', 'CI/CD Pipelines'],
  'Sales': ['B2B Sales', 'Lead Generation', 'Strategic Negotiation', 'CRM Tools (Hubspot)', 'Client Relations', 'Market Expansion', 'Sales Funnel Optimization'],
  'General': ['Git', 'Agile Sprints', 'Technical Writing', 'Problem Solving', 'Team Leadership', 'System Design']
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI Completion Helper
const getOpenAICompletion = async (promptText) => {
  if (!OPENAI_API_KEY) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: promptText }],
        max_tokens: 1200,
        temperature: 0.7
      })
    });
    const data = await res.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else if (data.error) {
      console.error('OpenAI API Error details:', data.error.message || data.error);
    }
  } catch (e) {
    console.error('OpenAI API query failed:', e.message);
  }
  return null;
};

// Gemini Completion Helper
const getGeminiCompletion = async (promptText) => {
  if (!aiClient) {
    return null;
  }

  try {
    const response = await aiClient.models.generateContent({
      model:
        process.env.GEMINI_MODEL ||
        "gemini-3.5-flash",

      contents: promptText,

      config: {
        temperature: 0.4,
      },
    });

    const generatedText =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    return generatedText
      ? generatedText.trim()
      : null;
  } catch (error) {
    console.error(
      "Gemini API query failed:",
      error.message
    );

    return null;
  }
};

// Combined AI Engine Helper (OpenAI -> Gemini -> Local Fallback)
const getAICompletion = async (promptText) => {
  const openAIRes = await getOpenAICompletion(promptText);
  if (openAIRes) return openAIRes;

  const geminiRes = await getGeminiCompletion(promptText);
  if (geminiRes) return geminiRes;

  return null;
};

// 1. Improve Summary
exports.improveSummary = async (req, res) => {
  try {
    const { summary, role } = req.body;
    const targetRole = role || 'General';

    console.log(`AI: Improving summary for role: ${targetRole}`);

    const prompt = `You are a professional resume writer. Re-write the following resume summary to make it highly polished, professional, and results-oriented for a "${targetRole}" role. Keep it concise (2-3 sentences max).
    Original Summary: "${summary || 'No summary provided'}"`;

    const aiResponse = await getAICompletion(prompt);

    if (aiResponse) {
      return res.status(200).json({ success: true, text: aiResponse });
    }

    // Local Fallback
    const list = localSummaries[targetRole] || localSummaries['General'];
    const fallbackText = list[Math.floor(Math.random() * list.length)];
    return res.status(200).json({ success: true, text: fallbackText });

  } catch (error) {
    console.error('Summary AI error:', error);
    res.status(500).json({ success: false, message: 'AI processing failed' });
  }
};

// 2. Rewrite Project Description
exports.rewriteProject = async (req, res) => {
  try {
    const { desc, role } = req.body;
    const targetRole = role || 'General';

    console.log(`AI: Rewriting project description for role: ${targetRole}`);

    const prompt = `You are a professional career coach. Rewrite the following project accomplishment description to make it sound results-oriented, using action verbs (e.g. Spearheaded, Engineered, Optimized) and introducing quantifiable impact.
    Original description: "${desc || 'Created web platform'}"`;

    const aiResponse = await getAICompletion(prompt);

    if (aiResponse) {
      return res.status(200).json({ success: true, text: aiResponse });
    }

    // Local Fallback
    const list = localProjects[targetRole] || localProjects['General'];
    const fallbackText = list[Math.floor(Math.random() * list.length)];
    return res.status(200).json({ success: true, text: fallbackText });

  } catch (error) {
    console.error('Project AI error:', error);
    res.status(500).json({ success: false, message: 'AI processing failed' });
  }
};

// 3. Suggest Skills
exports.suggestSkills = async (req, res) => {
  try {
    const { role } = req.body;
    const targetRole = role || 'General';

    console.log(`AI: Suggesting skills for role: ${targetRole}`);

    const prompt = `List the top 8 essential industry skills and technologies for a "${targetRole}" role, formatted strictly as a comma-separated list without numbering or bullets.`;

    const aiResponse = await getAICompletion(prompt);

    if (aiResponse) {
      const skillsArray = aiResponse.split(',').map(s => s.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')).filter(s => s.length > 0);
      return res.status(200).json({ success: true, skills: skillsArray });
    }

    // Local Fallback
    const fallbackSkills = localSkills[targetRole] || localSkills['General'];
    return res.status(200).json({ success: true, skills: fallbackSkills });

  } catch (error) {
    console.error('Skills AI error:', error);
    res.status(500).json({ success: false, message: 'AI processing failed' });
  }
};

// 4. Generate Cover Letter
exports.generateCoverLetter = async (req, res) => {
  try {
    const { name, email, role, summary } = req.body;
    const candidateName = name || 'John Doe';
    const targetRole = role || 'Software Developer';

    console.log(`AI: Generating cover letter for: ${candidateName} for role: ${targetRole}`);

    const prompt = `Write a professional, concise cover letter for ${candidateName} applying for the position of "${targetRole}". 
    Email: ${email || 'candidate@example.com'}. Use the following summary as a professional baseline: "${summary || ''}".`;

    const aiResponse = await getAICompletion(prompt);

    if (aiResponse) {
      return res.status(200).json({ success: true, text: aiResponse });
    }

    // Local Fallback
    const fallbackText = `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${targetRole} position. With my background and professional experience, I am confident in my ability to make an immediate, positive impact on your software engineering initiatives.

Throughout my career, I have dedicated myself to mastering modern architectural methodologies, streamlining client-side applications, and working collaboratively in high-velocity agile sprints. 

Thank you for your time and consideration. I welcome the opportunity to discuss my qualifications with you in greater detail.

Sincerely,
${candidateName}
${email || 'candidate@example.com'}`;

    return res.status(200).json({ success: true, text: fallbackText });

  } catch (error) {
    console.error('Cover letter AI error:', error);
    res.status(500).json({ success: false, message: 'AI processing failed' });
  }
};

// Full Rich Resume Generator Engine
const generateFullRoleResume = (targetTitle, expYears, skillListStr) => {
  const skillsArray = (skillListStr || '').split(',').map(s => s.trim()).filter(Boolean);
  const coreSkills = skillsArray.length > 0 ? skillsArray : ['Strategic Planning', 'Leadership', 'Project Management', 'Problem Solving', 'Data Analysis'];
  const roleName = targetTitle || 'Senior Specialist';
  const years = expYears || 3;

  return {
    summary: `Accomplished and results-driven ${roleName} with over ${years}+ years of specialized experience driving core organizational projects, optimizing operational workflows, and delivering high-impact solutions. Proven expertise in ${coreSkills.slice(0, 3).join(', ')}, coupled with a track record of boosting team efficiency by up to 35% and ensuring strict compliance with industry standards.`,
    skills: Array.from(new Set([...coreSkills, 'Strategic Planning', 'Process Optimization', 'Cross-Functional Leadership', 'Data Analysis', 'Quality Assurance', 'Agile Execution'])),
    experience: [
      {
        company: 'Apex Enterprise Solutions Inc.',
        position: `Lead ${roleName}`,
        duration: '2022 - Present',
        description: `• Spearheaded multi-million dollar operational initiatives using ${coreSkills.slice(0, 2).join(' and ')}, resulting in a 32% increase in project delivery speed.\n• Mentored and led a high-performing team of 8+ specialists, achieving a 98% quality audit score across all department deliverables.\n• Automated routine tracking workflows, reducing manual error rates by 40% YoY.`
      },
      {
        company: 'Vanguard Global Systems',
        position: `Senior ${roleName}`,
        duration: '2019 - 2022',
        description: `• Orchestrated end-to-end execution of high-priority client assignments using ${coreSkills.slice(1, 4).join(', ')}.\n• Designed and implemented standardized SOP protocols that decreased operational overhead costs by $180,000 annually.\n• Coordinated cross-departmental communications with C-level stakeholders to align project goals.`
      }
    ],
    projects: [
      {
        title: `${roleName} Performance Optimization Platform`,
        technology: coreSkills.slice(0, 3).join(', '),
        description: `Architected and deployed a comprehensive tracking system utilizing ${coreSkills.slice(0, 2).join(' and ')}, reducing process turnaround time by 30% and elevating client satisfaction scores to 96%.`
      },
      {
        title: `Enterprise Data & Workflow Integration`,
        technology: 'Cloud Infrastructure, Analytics Tools, Agile Framework',
        description: `Led cross-functional migration of legacy records into modern cloud dashboards, ensuring zero downtime and 100% data integrity.`
      }
    ],
    education: [
      {
        degree: `Bachelor of Science in ${roleName.includes('Nurse') ? 'Nursing (BSN)' : roleName.includes('Engineer') ? 'Computer Science' : 'Business Administration'}`,
        institution: 'State University of Technology',
        tenure: '2015 - 2019',
        cgpa: '3.8 / 4.0'
      }
    ],
    certifications: [
      `Certified ${roleName} Professional`,
      'Advanced Executive Leadership & Analytics Certification (2023)'
    ]
  };
};

// 5. Full Resume AI Generator
exports.generateResume = async (req, res) => {
  try {
    const { jobTitle, experience, skills } = req.body;
    const targetTitle = jobTitle || 'Software Engineer';
    const expYears = experience || 3;
    const skillList = skills || 'JavaScript, React, Node.js';

    console.log(`AI: Generating full resume for role: ${targetTitle}, exp: ${expYears} yrs, skills: ${skillList}`);

    const prompt = `Generate a comprehensive professional ATS-friendly resume.

Job Title: ${targetTitle}
Experience: ${expYears} years
Skills: ${skillList}

Return ONLY valid JSON with no markdown formatting or extra text.

{
  "summary": "A 3-sentence executive summary with achievements",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "experience": [
    {
      "company": "Apex Enterprise Solutions Inc.",
      "position": "${targetTitle}",
      "duration": "2022 - Present",
      "description": "• Spearheaded major projects using modern stacks.\\n• Improved team velocity by 35%."
    },
    {
      "company": "Vanguard Systems",
      "position": "Senior ${targetTitle}",
      "duration": "2019 - 2022",
      "description": "• Managed core deliverables and reduced costs by $150K."
    }
  ],
  "projects": [
    {
      "title": "${targetTitle} Enterprise Platform",
      "technology": "${skillList}",
      "description": "Built scalable solution with high client satisfaction."
    }
  ],
  "certifications": ["Certified Professional (2024)", "Executive Analytics Certificate"]
}`;

    const aiResponse = await getAICompletion(prompt);

    if (aiResponse) {
      try {
        const cleanJsonStr = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);
        if (parsed.summary && parsed.experience) {
          return res.status(200).json({ success: true, data: parsed });
        }
      } catch (parseErr) {
        console.error('Failed to parse AI JSON response, using rich local engine:', parseErr);
      }
    }

    // Rich Local Engine Fallback Data
    const fallbackData = generateFullRoleResume(targetTitle, expYears, skillList);
    return res.status(200).json({ success: true, data: fallbackData });

  } catch (error) {
    console.error('Generate Resume AI error:', error);
    const fallbackData = generateFullRoleResume(req.body.jobTitle, req.body.experience, req.body.skills);
    res.status(200).json({ success: true, data: fallbackData });
  }
};

// Smart Domain & Metric Preserving Local Text Enhancer
const smartEnhanceText = (text, section, role) => {
  const userText = (text || '').trim();
  const targetRole = role && role !== 'General' ? role : '';
  const targetSection = (section || '').toLowerCase();

  if (targetSection.includes('summary')) {
    if (userText.length > 10) {
      let enhanced = userText;
      if (!enhanced.toLowerCase().includes('results-driven') && !enhanced.toLowerCase().includes('dedicated')) {
        enhanced = 'Dedicated and results-driven ' + enhanced.charAt(0).toLowerCase() + enhanced.slice(1);
      }
      if (!enhanced.toLowerCase().includes('proven track record') && !enhanced.toLowerCase().includes('spearheaded')) {
        enhanced += ' Demonstrates a proven track record of advancing operational standards, optimizing workflow efficiency, and delivering high-impact outcomes.';
      }
      return enhanced;
    }
    return `Results-oriented ${targetRole || 'Professional'} with strong industry expertise, proven problem-solving capabilities, and a commitment to driving operational excellence.`;
  }

  if (targetSection.includes('experience') || targetSection.includes('project')) {
    if (userText.length > 10) {
      return `Spearheaded key initiatives: ${userText}. Optimized performance standards and delivered measurable impact across cross-functional operations.`;
    }
    return `Spearheaded critical project initiatives for ${targetRole || 'departmental'} operations, boosting workflow efficiency by 25% and ensuring high-quality deliverables.`;
  }

  if (targetSection.includes('skill')) {
    if (userText.length > 3) {
      return userText + ', Strategic Planning, Team Leadership, Process Optimization, Quality Assurance';
    }
    return 'Strategic Planning, Process Optimization, Communication, Team Leadership, Quality Control, Project Management';
  }

  if (targetSection.includes('ats')) {
    return "1. Use standard section headers (Experience, Education, Skills).\n2. Include target keywords matching the job description.\n3. Avoid tables or graphics inside the text area.";
  }

  return userText || `Strong professional alignment with ${targetRole || 'industry'} benchmarks. Ensure key metrics and quantifiable achievements are highlighted.`;
};

// 6. Unified AI Assistant Endpoint
exports.improve = async (req, res) => {
  try {
    const { text, section, role } = req.body;
    const targetRole = role || 'General';
    const targetSection = (section || '').toLowerCase();

    console.log(`AI Assist request: section="${targetSection}", role="${targetRole}"`);

    let prompt = '';
    if (targetSection.includes('summary')) {
      prompt = `You are an executive resume writer. Enhance and polish the following specific summary text for a "${targetRole}" role. Preserve their exact job title, domain keywords, numbers, and metrics, while elevating vocabulary and professional impact. DO NOT replace their role with a generic title.\nUser's Text: "${text || ''}"`;
    } else if (targetSection.includes('experience')) {
      prompt = `You are a career coach. Enhance the following work experience text using strong action verbs and quantifiable achievements for a "${targetRole}" position. Retain all user metrics:\n"${text || ''}"`;
    } else if (targetSection.includes('project')) {
      prompt = `Rewrite these project accomplishment bullet points for a "${targetRole}" portfolio to highlight technical innovation and business impact. Keep user details intact:\n"${text || ''}"`;
    } else if (targetSection.includes('skill')) {
      prompt = `Suggest 8-10 essential modern technical and soft skills for a "${targetRole}" role, separated by commas. User skills context: "${text || ''}"`;
    } else if (targetSection.includes('ats')) {
      prompt = `Provide 3 quick actionable ATS optimization tips for a "${targetRole}" resume based on standard ATS parsing guidelines.`;
    } else {
      prompt = `Provide a short, constructive professional review of this resume section for a "${targetRole}" position:\n"${text || ''}"`;
    }

    const aiResponse = await getAICompletion(prompt);
    if (aiResponse) {
      return res.status(200).json({ success: true, text: aiResponse });
    }

    // Smart Local Fallbacks preserving user context
    const enhancedLocalText = smartEnhanceText(text, targetSection, targetRole);
    return res.status(200).json({ success: true, text: enhancedLocalText });

  } catch (error) {
    console.error('AI Assist error:', error);
    const fallback = smartEnhanceText(req.body.text, req.body.section, req.body.role);
    res.status(200).json({ success: true, text: fallback });
  }
};
