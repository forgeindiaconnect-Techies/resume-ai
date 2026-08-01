const { GoogleGenAI } = require('@google/generative-ai');

// Check if Gemini API Key is present in environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let aiClient = null;

if (GEMINI_API_KEY) {
  try {
    // Note: in modern SDK it can be initialized like new GoogleGenAI() or directly importing GoogleGenAI
    // Or we use standard import of GoogleGenerativeAI from '@google/generative-ai'
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    aiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('Gemini AI Engine Initialized ✅');
  } catch (e) {
    console.error('Failed to initialize Gemini AI Client:', e.message);
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
        max_tokens: 300,
        temperature: 0.7
      })
    });
    const data = await res.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    }
  } catch (e) {
    console.error('OpenAI API query failed:', e.message);
  }
  return null;
};

// Gemini Completion Helper
const getGeminiCompletion = async (promptText) => {
  if (!aiClient) return null;
  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(promptText);
    const response = await result.response;
    return response.text().trim();
  } catch (e) {
    console.error('Gemini API query failed:', e.message);
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

// 5. Full Resume AI Generator
exports.generateResume = async (req, res) => {
  try {
    const { jobTitle, experience, skills } = req.body;
    const targetTitle = jobTitle || 'Software Engineer';
    const expYears = experience || 2;
    const skillList = skills || 'JavaScript, React, Node.js';

    console.log(`AI: Generating full resume for role: ${targetTitle}, exp: ${expYears} yrs, skills: ${skillList}`);

    const prompt = `Generate a professional ATS-friendly resume.

Job Title: ${targetTitle}
Experience: ${expYears} years
Skills: ${skillList}

Return ONLY valid JSON with no markdown formatting or extra text.

{
  "summary": "A 2-3 sentence professional summary",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "company": "Tech Solutions Inc.",
      "position": "${targetTitle}",
      "duration": "2022 - Present",
      "description": "Architected high-performance web applications using modern stacks."
    }
  ],
  "projects": [
    {
      "title": "E-Commerce SaaS Application",
      "description": "Built fullstack web application with payment integration."
    }
  ],
  "certifications": ["Certified Developer (2024)"]
}`;

    const aiResponse = await getAICompletion(prompt);

    if (aiResponse) {
      try {
        const cleanJsonStr = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);
        return res.status(200).json({ success: true, data: parsed });
      } catch (parseErr) {
        console.error('Failed to parse AI JSON response, returning text:', parseErr);
        return res.status(200).json({ success: true, data: aiResponse });
      }
    }

    // Local Fallback Data
    const fallbackData = {
      summary: `Dedicated and results-driven ${targetTitle} with over ${expYears} years of experience building scalable applications. Proven track record in ${skillList}.`,
      skills: skillList.split(',').map(s => s.trim()).filter(Boolean),
      experience: [
        {
          company: 'Apex Digital Solutions',
          position: targetTitle,
          duration: '2022 - Present',
          description: `Spearheaded the development of high-performance web services utilizing ${skillList}.`
        }
      ],
      projects: [
        {
          title: `${targetTitle} Core Dashboard`,
          description: `Designed and deployed responsive web interfaces with automated data pipelines using ${skillList}.`
        }
      ],
      certifications: ['AWS Certified Cloud Practitioner', 'Professional Developer Certification']
    };

    return res.status(200).json({ success: true, data: fallbackData });

  } catch (error) {
    console.error('Generate Resume AI error:', error);
    res.status(500).json({ success: false, message: 'AI resume generation failed' });
  }
};
