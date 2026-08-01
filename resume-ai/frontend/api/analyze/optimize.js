import { optimizeResume } from '../_utils/resumeRefinery.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Process JSON body (standard bodyParser is on by default for non-multer routes)
    // However, if Vercel doesn't auto-parse, we handle chunks.
    let body = req.body;
    if (typeof body === 'string') {
        body = JSON.parse(body);
    } else if (!body || Object.keys(body).length === 0) {
        // Fallback for manual stream reading if body is empty
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const rawBody = Buffer.concat(chunks).toString();
        body = JSON.parse(rawBody || '{}');
    }

    const { analysis, role = 'General' } = body;
    
    console.log(`[OPTIMIZE API] Processing optimization for ${role}...`);
    const optimization = optimizeResume(analysis, role);
    
    return res.status(200).json(optimization);
  } catch (error) {
    console.error('[OPTIMIZE ERROR]', error);
    return res.status(500).json({ error: 'Optimization failed', details: error.message });
  }
}
