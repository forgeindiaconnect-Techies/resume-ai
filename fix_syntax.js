const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(process.cwd(), 'client/src/components/layouts');

// Fix ModernLayout case blocks
const modernPath = path.join(layoutsDir, 'ModernLayout.jsx');
let modern = fs.readFileSync(modernPath, 'utf8');
modern = modern.replace(/case 'achievements':/g, "case 'achievements': {");
modern = modern.replace(/case 'interests':/g, "case 'interests': {");
modern = modern.replace(/case 'certificates':/g, "case 'certificates': {");
modern = modern.replace(/return achievements && achievements.length > 0 \? \(([\s\S]*?)\) : null;/g, "return achievements && achievements.length > 0 ? ($1) : null; }");
modern = modern.replace(/return interestsList && interestsList.length > 0 \? \(([\s\S]*?)\) : null;/g, "return interestsList && interestsList.length > 0 ? ($1) : null; }");
modern = modern.replace(/return trainingList && trainingList.length > 0 \? \(([\s\S]*?)\) : null;/g, "return trainingList && trainingList.length > 0 ? ($1) : null; }");
// Actually, it's safer to just remove the const and let from case blocks if they exist.
modern = modern.replace(/const icons =/g, "var icons =");
fs.writeFileSync(modernPath, modern);

// Fix EnhancvLayout
const enhancvPath = path.join(layoutsDir, 'EnhancvLayout.jsx');
let enhancv = fs.readFileSync(enhancvPath, 'utf8');
if (!enhancv.includes('const fScale')) {
  enhancv = enhancv.replace('const EnhancvLayout =', 'const fScale = (fontSize || 13) / 13;\n\nconst EnhancvLayout =');
}
if (!enhancv.includes('const primaryAccent')) {
  enhancv = enhancv.replace('const EnhancvLayout =', 'const primaryAccent = customColor || "#000";\n\nconst EnhancvLayout =');
}
// Fix where it is placed because we need fontSize from props
enhancv = enhancv.replace(/const fScale = \([^)]+\) \/ 13;\n\nconst EnhancvLayout = [^{]+\{/g, "const EnhancvLayout = ({ data, customColor, secondaryColor, customFont, headingSize, fontSize, lineHeight, theme, sections: customSections, spacing = 'normal', layoutMode = 'left-sidebar', profilePosition = 'left', profilePhoto }) => {\n  const fScale = (fontSize || 13) / 13;\n  const primaryAccent = customColor || \"#000\";");
fs.writeFileSync(enhancvPath, enhancv);

console.log("Fixed syntax");
