import dbConnect from './_utils/db.js';
import Candidate from './_models/Candidate.js';
import { sendUploadConfirmation } from './_utils/emailService.js';

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  try {
    // --- Logic for /api/candidates/rank ---
    if (pathname.includes('/rank') && req.method === 'POST') {
      const { candidates = [] } = req.body;
      if (!candidates || candidates.length === 0) {
        return res.status(400).json({ error: 'No candidates provided for ranking' });
      }
      const ranked = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));
      return res.status(200).json(ranked);
    }

    // --- Logic for /api/candidates ---
    const db = await dbConnect().catch(dbErr => {
      console.error('[CANDIDATES API] Connection failed:', dbErr.message);
      return null;
    });
    
    if (!db) {
      if (req.method === 'GET') return res.status(200).json([]);
      return res.status(503).json({ error: 'Database Connectivity Issue' });
    }

    if (req.method === 'GET') {
      const results = await Candidate.find({}).sort({ createdAt: -1 }).limit(100);
      const candidates = results.map(c => {
        const obj = c.toObject();
        obj.id = obj._id.toString();
        return obj;
      });
      return res.status(200).json(candidates || []);
    } 

    if (req.method === 'POST') {
      const candidateData = req.body;
      if (!candidateData.name) {
        return res.status(400).json({ error: 'Candidate name is required' });
      }
      
      const newCandidate = await Candidate.create({
        ...candidateData,
        status: candidateData.status || 'Applied',
        updatedAt: new Date()
      });

      // Email notification (Non-blocking)
      if (newCandidate.email && newCandidate.email.includes('@')) {
        sendUploadConfirmation({
          email: newCandidate.email,
          name: newCandidate.name
        }).catch(err => console.error('[EMAIL ERROR]', err.message));
      }

      return res.status(201).json(newCandidate);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[CANDIDATES API] Critical Exception:', error);
    if (req.method === 'GET') return res.status(200).json([]);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
