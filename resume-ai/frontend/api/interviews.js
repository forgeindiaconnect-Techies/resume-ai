import { v4 as uuidv4 } from 'uuid';
import { sendInterviewEmail } from './_utils/emailService.js';

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  try {
    // --- Logic for /api/interviews/validate ---
    if (pathname.includes('/validate') && req.method === 'GET') {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: 'Missing token' });
      return res.status(200).json({
        isValid: true,
        candidateName: "DEMO CANDIDATE",
        role: "React Developer",
        message: "Interview token validated."
      });
    }

    // --- Logic for /api/interviews/generate ---
    if (pathname.includes('/generate') && req.method === 'POST') {
      const { userRole, candidateEmail, candidateName } = req.body;
      if (userRole !== 'HR') return res.status(403).json({ error: 'Only HR can generate interview links' });
      
      const token = uuidv4();
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 48);
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['host'];
      const interviewLink = `${protocol}://${host}/interview/${token}`;

      if (candidateEmail && candidateName) {
        await sendInterviewEmail(
          { email: candidateEmail, name: candidateName },
          { date: expiry.toLocaleDateString(), time: expiry.toLocaleTimeString(), link: interviewLink }
        );
      }
      return res.status(200).json({ success: true, token, expiry, link: interviewLink });
    }

    // --- Default Handler ---
    return res.status(200).json({ message: "Interviews API Active" });
  } catch (error) {
    console.error('[INTERVIEWS API ERROR]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
