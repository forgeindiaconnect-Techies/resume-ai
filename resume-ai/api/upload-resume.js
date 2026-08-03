import dbConnect from './_utils/db.js';
import Resume from './_models/Resume.js';
import multer from 'multer';

// Use memory storage for Vercel serverless environment
const storage = multer.memoryStorage();
const upload = multer({ storage });

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

export const config = { api: { bodyParser: false } };

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

  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  try {
    await dbConnect();
    await runMiddleware(req, res, upload.single('resume'));

    const { employeeName, email } = req.body;
    const file = req.file;

    if (!employeeName || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // In Vercel, we can't save to a local 'uploads' folder permanentely.
    // For this implementation, we save the record to MongoDB so it shows up in the Vault.
    // In a full production app, you would upload to AWS S3 or Cloudinary here.
    
    const newResume = await Resume.create({
      employeeName,
      email,
      fileName: file ? file.originalname : 'Manual Entry',
      filePath: 'uploads/placeholder.pdf', // Placeholder for Vercel
      uploadDate: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Resume logged in Vault successfully (Vercel)',
      data: newResume,
    });
  } catch (error) {
    console.error('Vercel Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
