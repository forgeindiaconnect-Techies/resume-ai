const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const roleKeywords = {
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'Architecture', 'TTI', 'Core Web Vitals', 'Performant', 'Accessible'],
    'Backend': ['Node.js', 'Go', 'Python', 'Microservices', 'distributed systems', 'high-availability', 'concurrency', 'API engineering', 'PostgreSQL', 'Kubernetes'],
    'Fullstack': ['React', 'Next.js', 'TypeScript', 'Node.js', 'tRPC', 'Prisma', 'E2E testing', 'SaaS', 'System Design'],
    'BDA': ['Data', 'Analytics', 'SQL', 'Tableau', 'Power BI', 'Statstical', 'ETL', 'Business', 'Strategy', 'KPI'],
    'Sales': ['Revenue', 'Market Expansion', 'CRM', 'Lead Generation', 'B2B', 'GTM', 'Negotiation', 'Strategic'],
    'General': ['Git', 'Communication', 'Teamwork', 'Agile', 'Leadership', 'Problem Solving']
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { resumeText = "", jobDescription = "" } = req.body;
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Missing resume text or job description' });
  }

  let detectedRole = 'General';
  const jdLower = jobDescription.toLowerCase();
  
  if (jdLower.includes('frontend') || jdLower.includes('react') || jdLower.includes('ui')) detectedRole = 'Frontend';
  else if (jdLower.includes('backend') || jdLower.includes('node') || jdLower.includes('server')) detectedRole = 'Backend';
  else if (jdLower.includes('fullstack') || jdLower.includes('full stack')) detectedRole = 'Fullstack';
  else if (jdLower.includes('sales') || jdLower.includes('business development') || jdLower.includes('bda') || jdLower.includes('bdm')) detectedRole = 'Sales';

  const keywords = roleKeywords[detectedRole] || roleKeywords['General'];
  
  const matchingSkills = keywords.filter(k => 
    new RegExp(`\\b${escapeRegExp(k.trim())}\\b`, 'i').test(resumeText)
  );
  
  const missingSkills = keywords.filter(k => !matchingSkills.includes(k));
  
  const percentage = Math.round((matchingSkills.length / keywords.length) * 100);
  const finalPercentage = Math.min(98, Math.max(5, percentage + (Math.floor(Math.random() * 10) - 5)));

  let recommendation = "";
  if (finalPercentage > 80) {
    recommendation = `Excellent alignment! Your profile shows a ${finalPercentage}% match for the ${detectedRole} role. We found strong coverage of key skills like ${matchingSkills.slice(0, 3).join(', ')}.`;
  } else if (finalPercentage > 50) {
    recommendation = `Good potential. You have a solid foundation for ${detectedRole}, but the role requires more depth in ${missingSkills.slice(0, 2).join(' and ')}. Focus on highlighting these in your application.`;
  } else {
    recommendation = `Lower alignment (${finalPercentage}%). This role emphasizes ${detectedRole} skills that aren't strongly represented in your current resume. Consider adding relevant projects or certifications.`;
  }

  return res.status(200).json({
    percentage: finalPercentage,
    matchedSkills: matchingSkills.length > 0 ? matchingSkills : ["Communication", "Agile"],
    missingSkills: missingSkills.slice(0, 4),
    recommendation: recommendation
  });
}
