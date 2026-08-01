import dbConnect from './_utils/db.js';
import Resume from './_models/Resume.js';

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

  if (req.method !== 'GET') return res.status(405).json({ message: 'Only GET allowed' });

  try {
    await dbConnect();
    const resumes = await Resume.find({}).sort({ uploadDate: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    console.error('Vercel Fetch Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
