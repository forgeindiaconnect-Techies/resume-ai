const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'client/src/components/layouts');
const files = [
  'ModernLayout.jsx',
  'MinimalLayout.jsx',
  'ProfessionalLayout.jsx',
  'CreativeLayout.jsx',
  'ExecutiveLayout.jsx',
  'EnhancvLayout.jsx'
];

files.forEach(file => {
  const filePath = path.join(layoutsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Add lineHeight and theme to destructured props if not already there
  if (!content.includes('lineHeight,')) {
    content = content.replace(/fontSize,/, "fontSize,\n  lineHeight,\n  theme,");
  }

  // 2. Add fScale definition
  if (!content.includes('const fScale')) {
    content = content.replace(/if \(!data\) return null;/, "if (!data) return null;\n\n  const fScale = (fontSize || 13) / 13;");
  }

  // 3. Update lineH calculation
  content = content.replace(/const lineH = [^;\n]+;/, "const lineH = lineHeight || 1.6;");

  // 4. Update spacingPadding to use theme.margin
  content = content.replace(/const spacingPadding = [^;\n]+;/, "const spacingPadding = theme?.margin ? `${theme.margin}px` : '2rem';");

  // 5. Replace all fontSize: '1.2rem' with template literals multiplying by fScale
  // Match both single and double quotes, but ONLY IF they haven't been replaced yet
  content = content.replace(/fontSize:\s*['"]([0-9.]+)rem['"]/g, "fontSize: `${$1 * fScale}rem`");

  // 6. Replace hardcoded font families with `fontFamily`
  content = content.replace(/fontFamily:\s*['"][^'"]+['"]/g, "fontFamily: fontFamily");

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
