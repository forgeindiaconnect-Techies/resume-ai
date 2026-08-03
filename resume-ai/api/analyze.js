import multer from 'multer';
import mammoth from 'mammoth';
import dbConnect from './_utils/db.js';
import { createRequire } from 'module';
import { analyzeResume, extractPersonalDetails } from './_utils/resumeRefinery.js';

const require = createRequire(import.meta.url);

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
}).single('resume');

// --- Robust File Extraction ---
const extractTextFromPDF = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) return "";
        const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
        
        const loadingTask = getDocument({
            data: new Uint8Array(buffer),
            useSystemFonts: true,
            isEvalSupported: false,
            disableFontFace: true
        });

        const pdf = await loadingTask.promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        return fullText || "";
    } catch (error) {
        console.warn('[ANALYZE API] PDF Extraction Warning:', error.message);
        try {
            const pdfParse = require('pdf-parse/lib/pdf-parse.js');
            const data = await pdfParse(buffer);
            return data.text || "";
        } catch (fallbackError) {
            return ""; 
        }
    }
};

const extractTextFromDOCX = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) return "";
        const result = await mammoth.extractRawText({ buffer });
        return result.value || "";
    } catch (error) {
        throw new Error('Failed to read DOCX file.');
    }
};

const runMiddleware = (req, res, fn) => new Promise((resolve, reject) => {
  fn(req, res, (result) => result instanceof Error ? reject(result) : resolve(result));
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await runMiddleware(req, res, upload);
    const file = req.file;
    const { role = 'General' } = req.body;
    
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let text = "";
    if (file.mimetype === 'application/pdf') {
        text = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype.includes('word') || file.mimetype.includes('officedocument')) {
        text = await extractTextFromDOCX(file.buffer);
    }

    const results = analyzeResume(text, role);
    const finalData = { ...results, role, extractedText: text };

    try {
        await dbConnect();
        const Candidate = (await import('./_models/Candidate.js')).default;
        const details = extractPersonalDetails(text);
        await Candidate.create({
            name: details.name,
            email: details.email,
            fileName: file.originalname,
            status: 'Applied',
            score: finalData.score,
            matchPercentage: finalData.matchPercentage,
            verdict: finalData.verdict,
            extractedText: text,
            timestamp: new Date()
        });
    } catch (dbErr) { console.error('[DB ERROR]', dbErr.message); }

    return res.status(200).json(finalData);
  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ error: 'Process failed', details: error.message });
  }
}
