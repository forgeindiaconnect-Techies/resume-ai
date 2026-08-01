const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromPDF = async (buffer) => {
    try {
        if (!buffer || buffer.length === 0) return "";
        
        // Primary: pdfjs-dist (More robust for corrupted XRef tables)
        try {
            // pdfjs-dist v5+ is ESM only, use dynamic import
            // In Node CJS, we must use dynamic import()
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

            if (fullText.trim().length > 0) return fullText;
        } catch (pdfjsError) {
            console.warn('pdfjs-dist failed, attempting fallback:', pdfjsError.message);
        }

        // Secondary: pdf-parse (Legacy fallback)
        const parser = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
        if (typeof parser === 'function') {
            const data = await parser(buffer);
            return data.text || "";
        }

        return "";
    } catch (error) {
        console.error('CRITICAL PDF Parsing Error:', error.message);
        return "";
    }
};

const extractTextFromDOCX = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error('Error parsing DOCX:', error);
        throw new Error('Failed to parse DOCX');
    }
};

module.exports = {
    extractTextFromPDF,
    extractTextFromDOCX
};
