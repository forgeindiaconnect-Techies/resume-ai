const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const crypto = require('crypto');
const { sendUploadConfirmation, sendInterviewEmail, sendSelectionEmail, sendRejectionEmail } = require('../utils/emailService');

// DB persistence is now managed by Mongoose/MongoDB

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');

// Ensure data directory exists if it was in a subfolder (but database.json is in root)
// If you want to keep the data folder, we can move it, but database.json is historically in backend root.

// Helper to read/write local data
const getLocalData = () => {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const parsed = JSON.parse(data || '{}');
        return Array.isArray(parsed) ? parsed : (parsed.candidates || []);
    } catch (e) {
        console.error('Error reading local database:', e.message);
        return [];
    }
};

const saveLocalData = (data) => {
    // Keep the object structure for compatibility with index.js's style
    const payload = { candidates: data };
    fs.writeFileSync(DB_PATH, JSON.stringify(payload, null, 2));
};

const isDBConnected = () => mongoose.connection.readyState === 1;

const getCandidates = async (req, res) => {
    try {
        if (isDBConnected()) {
            const candidates = await Candidate.find({}).sort({ createdAt: -1 });
            return res.json(candidates);
        }
        // Fallback
        const locals = getLocalData().sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(locals);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
};

const addCandidate = async (req, res) => {
    try {
        const status = req.body.status || 'Applied';
        const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
        
        const notifications = [
            {
                id: `${Date.now()}-1`,
                type: 'Confirmation',
                message: 'Application received successfully. AI initial screening in progress.',
                date: timestampStr
            }
        ];

        if (status === 'Selected') {
            notifications.push({
                id: `${Date.now()}-2`,
                type: 'Selected',
                message: 'Congratulations! You have been selected for the next round.',
                date: timestampStr
            });
        } else if (status === 'Rejected') {
            notifications.push({
                id: `${Date.now()}-2`,
                type: 'Rejected',
                message: 'Thank you for your interest. Unfortunately, we will not be moving forward with your application.',
                date: timestampStr
            });
        }

        let newCandidate;
        if (isDBConnected()) {
            newCandidate = await Candidate.create({
                ...req.body,
                status,
                notifications
            });
        } else {
            // Local persistence fallback
            const locals = getLocalData();
            newCandidate = {
                _id: Date.now().toString(),
                id: Date.now().toString(),
                ...req.body,
                status,
                notifications,
                extractedText: req.body.extractedText || '',
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            locals.push(newCandidate);
            saveLocalData(locals);
        }

        if (newCandidate.email && newCandidate.email !== 'candidate@example.com') {
            try {
                await sendUploadConfirmation(newCandidate);
            } catch (err) {
                console.error('Email confirmation failed (continuing):', err.message);
            }
        }

        res.status(201).json(newCandidate);
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ error: 'Failed to add candidate', details: error.message });
    }
};

const updateCandidate = async (req, res) => {
    const { id } = req.params;
    try {
        let candidate;
        if (isDBConnected()) {
            candidate = await Candidate.findById(id);
        } else {
            const locals = getLocalData();
            candidate = locals.find(c => c._id === id || c.id === id);
        }

        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

        const oldStatus = candidate.status;
        const newStatus = req.body.status || oldStatus;
        
        // Preserve secure interview token before assignment
        const existingToken = candidate.interview?.token;

        // Update candidate fields
        Object.assign(candidate, req.body);

        // Restore token if it was overwritten
        if (existingToken && req.body.interview) {
            candidate.interview.token = existingToken;
        }
        
        if (req.body.status && req.body.status !== oldStatus) {
            let message = `Status updated to ${req.body.status.toUpperCase()}.`;
            let link = null;

            if (req.body.status === 'Selected') message = 'Congratulations! You have been selected for the next round.';
            if (req.body.status === 'Rejected') message = 'Thank you for your interest. Unfortunately, we will not be moving forward with your application.';
            if (req.body.status === 'Interview') {
                const { date, time, link: meetLink } = req.body.interview || {};
                message = `Your interview has been scheduled for ${date || 'TBD'} at ${time || 'TBD'}. Please check the meeting link to join.`;
                link = meetLink;
            }

            if (!candidate.notifications) candidate.notifications = [];
            candidate.notifications.push({
                id: Date.now().toString(),
                type: req.body.status,
                message,
                link,
                date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
            });

            // Trigger Emails
            if (candidate.email && candidate.email !== 'candidate@example.com') {
                try {
                    if (req.body.status === 'Interview') {
                        if (!candidate.interview?.token) {
                            candidate.interview = candidate.interview || {};
                            candidate.interview.token = crypto.randomBytes(16).toString('hex');
                        }
                        await sendInterviewEmail(candidate, candidate.interview);
                    } else if (req.body.status === 'Selected') {
                        await sendSelectionEmail(candidate);
                    } else if (req.body.status === 'Rejected') {
                        await sendRejectionEmail(candidate);
                    }
                } catch (emailErr) {
                    console.error('Email trigger failed:', emailErr.message);
                }
            }
        }

        if (isDBConnected()) {
            await candidate.save();
        } else {
            const locals = getLocalData();
            const idx = locals.findIndex(c => c._id === id || c.id === id);
            locals[idx] = candidate;
            saveLocalData(locals);
        }
        res.json(candidate);
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ error: 'Failed to update candidate' });
    }
};

const deleteCandidate = async (req, res) => {
    const { id } = req.params;
    try {
        if (isDBConnected()) {
            await Candidate.findByIdAndDelete(id);
        } else {
            const locals = getLocalData().filter(c => c._id !== id && c.id !== id);
            saveLocalData(locals);
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete candidate' });
    }
};

const rankCandidates = async (req, res) => {
    try {
        if (isDBConnected()) {
            const ranked = await Candidate.find({}).sort({ score: -1 });
            return res.json(ranked);
        }
        const locals = getLocalData().sort((a,b) => (b.score || 0) - (a.score || 0));
        res.json(locals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to rank candidates' });
    }
};

const generateInterviewToken = async (req, res) => {
    const { candidateId } = req.body;
    try {
        let candidate;
        if (isDBConnected()) {
            candidate = await Candidate.findById(candidateId);
        } else {
            const locals = getLocalData();
            candidate = locals.find(c => c._id === candidateId || c.id === candidateId);
        }

        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

        if (!candidate.interview?.token) {
            candidate.interview = candidate.interview || {};
            candidate.interview.token = crypto.randomBytes(16).toString('hex');
            
            if (isDBConnected()) {
                await candidate.save();
            } else {
                const locals = getLocalData();
                const idx = locals.findIndex(c => c._id === candidateId || c.id === candidateId);
                locals[idx] = candidate;
                saveLocalData(locals);
            }
        }
        res.json({ token: candidate.interview.token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate token' });
    }
};

const validateToken = async (req, res) => {
    const { token } = req.params;
    try {
        let candidate;
        if (isDBConnected()) {
            candidate = await Candidate.findOne({ 'interview.token': token });
        } else {
            candidate = getLocalData().find(c => c.interview?.token === token);
        }

        if (!candidate) return res.status(404).json({ error: 'Invalid link' });

        res.json({
            candidateName: candidate.name,
            role: candidate.role,
            interview: candidate.interview
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to validate token' });
    }
};

module.exports = {
    getCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    rankCandidates,
    generateInterviewToken,
    validateToken
};

