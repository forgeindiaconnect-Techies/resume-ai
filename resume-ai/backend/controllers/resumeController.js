const ResumeSession = require('../models/ResumeSession');
const ResumeData = require('../models/ResumeData');

// 1. Initialize or Load Edit Session
exports.initializeSession = async (req, res) => {
  try {
    const { userId, guestId, templateId, jobRole, resumeJson } = req.body;

    let session;
    if (userId) {
      session = await ResumeSession.findOne({ userId, jobRole, status: 'draft' });
    } else if (guestId) {
      session = await ResumeSession.findOne({ guestId, jobRole, status: 'draft' });
    }

    if (!session) {
      session = await ResumeSession.create({
        userId: userId || null,
        guestId: guestId || null,
        templateId: templateId || 'modern-blue',
        jobRole: jobRole || 'React Developer'
      });
      
      // Build initial mock data fields or use prefill if supplied
      await ResumeData.create({
        sessionId: session._id,
        personal: {
          name: resumeJson?.name || '',
          email: resumeJson?.contact?.email || '',
          phone: resumeJson?.contact?.phone || '',
          location: resumeJson?.contact?.location || '',
          linkedin: resumeJson?.contact?.linkedin || '',
          github: resumeJson?.contact?.github || '',
          portfolio: resumeJson?.contact?.portfolio || '',
          summary: resumeJson?.objective || ''
        },
        experience: resumeJson?.experience?.map(e => ({
          company: e.company || '',
          role: e.title || '',
          duration: e.duration || '',
          desc: e.desc || ''
        })) || [],
        education: resumeJson?.education?.map(edu => ({
          school: edu.institution || '',
          degree: edu.degree || '',
          department: '',
          cgpa: edu.cgpa || '',
          year: edu.tenure || ''
        })) || [],
        projects: resumeJson?.projects?.map(p => ({
          name: p.title || '',
          technology: p.technology || '',
          desc: p.desc || '',
          github: '',
          liveDemo: ''
        })) || [],
        skills: {
          programming: resumeJson?.skills?.languages?.split(',').map(s => s.trim()).filter(Boolean) || [],
          frameworks: resumeJson?.skills?.frameworks?.split(',').map(s => s.trim()).filter(Boolean) || [],
          databases: resumeJson?.skills?.tools?.split(',').map(s => s.trim()).filter(Boolean) || []
        },
        certificates: resumeJson?.training?.map(tr => ({
          name: tr || '',
          organization: '',
          year: ''
        })) || []
      });
    }

    const data = await ResumeData.findOne({ sessionId: session._id });
    res.status(200).json({
      success: true,
      sessionId: session._id,
      session,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Fetch Session Data
exports.getSessionData = async (req, res) => {
  try {
    const session = await ResumeSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const data = await ResumeData.findOne({ sessionId: session._id });
    res.status(200).json({ success: true, session, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Auto-save updates
exports.saveSessionData = async (req, res) => {
  try {
    const { personal, education, experience, projects, skills, certificates, languages, achievements } = req.body;
    
    const updated = await ResumeData.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { personal, education, experience, projects, skills, certificates, languages, achievements },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Resume data target not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
