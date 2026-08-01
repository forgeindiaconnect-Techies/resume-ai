const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function testPdfJs() {
    try {
        console.log('PDF.js version:', pdfjsLib.version);
        // In Node.js, we don't necessarily need a worker for simple text extraction if using legacy build or configuring it right
    } catch (e) {
        console.error('Error:', e);
    }
}

testPdfJs();
