const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(process.cwd(), 'client/src/components/layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let p = path.join(layoutsDir, file);
  let c = fs.readFileSync(p, 'utf8');

  // Replace lineHeight: 1.x with lineHeight: lineH
  c = c.replace(/lineHeight:\s*[0-9.]+/g, "lineHeight: lineH");

  // Replace padding for columns (those starting with 1. or 2. or 3. rem) with spacingPadding
  c = c.replace(/padding:\s*['"]([1-3]\.[0-9]+rem\s+[0-9.]+rem|1\.5rem|2rem|3rem)['"]/g, "padding: spacingPadding");
  
  // Also some paddings might be '2.2rem 1.8rem' or '1.75rem 2rem'
  c = c.replace(/padding:\s*['"][1-4](\.[0-9]+)?rem\s+[1-4](\.[0-9]+)?rem['"]/g, "padding: spacingPadding");

  // Replace padding for the outermost wrapper if it exists and is > 1rem
  c = c.replace(/padding:\s*['"][1-4](\.[0-9]+)?rem['"]/g, "padding: spacingPadding");

  fs.writeFileSync(p, c);
  console.log(`Updated ${file}`);
});
