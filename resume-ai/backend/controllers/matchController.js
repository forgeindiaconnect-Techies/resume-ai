const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const extractTechKeywords = (text) => {
    if (!text) return [];
    
    const techLibrary = [
        'React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes',
        'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Redux', 'Express', 'Tailwind', 'Next.js', 'Vue',
        'Angular', 'C++', 'Go', 'Rust', 'Cloud', 'Azure', 'GCP', 'DevOps', 'CI/CD', 'Agile', 'Scrum',
        'Figma', 'UI', 'UX', 'Design', 'HTML', 'CSS', 'Git', 'Linux', 'Microservices', 'GraphQL', 'REST'
    ];
    
    return techLibrary.filter(k => new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(text));
};

const match = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Missing resume text or job description' });
        }

        const jdSkills = extractTechKeywords(jobDescription);
        const resumeSkills = extractTechKeywords(resumeText);

        const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
        const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));

        let percentage = 0;
        if (jdSkills.length > 0) {
            percentage = Math.round((matchedSkills.length / jdSkills.length) * 100);
        } else {
            // Fallback if no specific skills found in JD
            percentage = 50; 
        }

        let recommendation = '';
        if (percentage >= 80) {
            recommendation = "Excellent alignment! The candidate possesses almost all the technical requirements for this role.";
        } else if (percentage >= 60) {
            recommendation = "Good potential. The candidate has a solid foundation but is missing a few specific tools mentioned in the job description.";
        } else {
            recommendation = "Significant skill gaps detected. The candidate lacks many core requirements for this position.";
        }

        res.json({
            percentage,
            matchedSkills,
            missingSkills,
            recommendation
        });
    } catch (error) {
        console.error('Match error:', error);
        res.status(500).json({ 
            error: 'Failed to calculate match', 
            details: error.message 
        });
    }
};

module.exports = {
    match
};
