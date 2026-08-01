const pdfParse = require('pdf-parse');
console.log('Type of pdfParse:', typeof pdfParse);
if (typeof pdfParse !== 'function') {
    console.log('It is not a function. Keys:', Object.keys(pdfParse));
} else {
    console.log('It is a function!');
}
