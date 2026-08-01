const fs = require('fs');
const path = require('path');
const { extractTextFromPDF } = require('./utils/pdfParser');

async function verifyFix() {
    const pdfPath = path.join(__dirname, 'sample_resume.pdf');
    if (!fs.existsSync(pdfPath)) {
        console.error('Sample PDF not found!');
        return;
    }

    const buffer = fs.readFileSync(pdfPath);
    console.log('Testing PDF extraction on:', pdfPath);
    
    try {
        const text = await extractTextFromPDF(buffer);
        console.log('--- Extracted Text Preview ---');
        console.log(text.substring(0, 500));
        console.log('------------------------------');
        console.log('Text Length:', text.length);
        
        if (text.length > 0) {
            console.log('SUCCESS: PDF extraction is working with the new logic.');
        } else {
            console.log('FAILURE: Extracted text is empty.');
        }
    } catch (e) {
        console.error('CRITICAL FAILURE:', e);
    }
}

verifyFix();
