const { extractTextFromPDF, extractTextFromDOCX } = require('../utils/pdfParser');
const {
    parseResumeContent,
    analyzeResume,
    optimizeResume,
    generateCareerRoadmap,
    calculateDetailedMatch
} = require('../utils/aiPrompt');

const analyze = async (req, res) => {
    try {
        const file = req.file;
        const role = req.body.role || 'General';
        const jd = req.body.jd || '';

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let text = '';
        if (file.mimetype === 'application/pdf') {
            text = await extractTextFromPDF(file.buffer);
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            text = await extractTextFromDOCX(file.buffer);
        } else {
            return res.status(400).json({ error: 'Unsupported file format' });
        }

        const parsedData = parseResumeContent(text);
        const analysisResults = analyzeResume(parsedData, role, jd);
        
        // New Expert Insights
        const detailedMatch = calculateDetailedMatch(text, jd);
        res.json({
            ...analysisResults,
            detailedMatch,
            role,
            extractedText: text
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze resume', 
            details: error.message 
        });
    }
};

const optimize = async (req, res) => {
    try {
        const { analysis, role, jd } = req.body;

        if (!analysis || !role) {
            return res.status(400).json({ error: 'Missing analysis data or role' });
        }

        const optimization = optimizeResume(analysis, role, jd);
        const roadmap = generateCareerRoadmap(analysis, role);

        res.json({
            ...optimization,
            ...roadmap
        });
    } catch (error) {
        console.error('Optimization error:', error);
        res.status(500).json({ 
            error: 'Failed to optimize resume', 
            details: error.message 
        });
    }
};

module.exports = {
    analyze,
    optimize
};
