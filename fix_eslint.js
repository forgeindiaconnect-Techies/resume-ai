const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(process.cwd(), 'client/src/components/layouts');

// Fix EnhancvLayout.jsx ESLint Component in Render error
let enhancvPath = path.join(layoutsDir, 'EnhancvLayout.jsx');
let enhancvCode = fs.readFileSync(enhancvPath, 'utf8');

if (enhancvCode.includes('const SectionHeader = ({ title }) => (')) {
  // Extract SectionHeader
  const headerStart = enhancvCode.indexOf('const SectionHeader = ({ title }) => (');
  const headerEnd = enhancvCode.indexOf(');', headerStart) + 2;
  const headerBlock = enhancvCode.substring(headerStart, headerEnd);
  
  // Remove from inside the component
  enhancvCode = enhancvCode.replace(headerBlock, '');
  
  // Add to top of file after imports
  const importEnd = enhancvCode.lastIndexOf('import ');
  const importEndLine = enhancvCode.indexOf('\n', importEnd) + 1;
  enhancvCode = enhancvCode.slice(0, importEndLine) + '\n' + headerBlock + '\n' + enhancvCode.slice(importEndLine);
  fs.writeFileSync(enhancvPath, enhancvCode);
}

// Fix missing props destructuring in all layouts except Modern
const files = [
  'MinimalLayout.jsx',
  'ProfessionalLayout.jsx',
  'CreativeLayout.jsx',
  'ExecutiveLayout.jsx',
  'EnhancvLayout.jsx'
];

files.forEach(file => {
  const filePath = path.join(layoutsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find the props destructuring block
  const componentMatch = content.match(/const [A-Za-z]+Layout = \(\{([\s\S]*?)\}\) => \{/);
  if (componentMatch) {
    let props = componentMatch[1];
    
    // Add missing props
    const missingProps = [];
    if (!props.includes('fontSize')) missingProps.push('fontSize');
    if (!props.includes('lineHeight')) missingProps.push('lineHeight');
    if (!props.includes('theme')) missingProps.push('theme');
    if (!props.includes('customFont')) missingProps.push('customFont');

    if (missingProps.length > 0) {
      const newProps = props.trim() + ',\n  ' + missingProps.join(',\n  ') + '\n';
      content = content.replace(componentMatch[1], newProps);
    }
  }
  
  // Make sure fontFamily is defined
  if (!content.includes('const fontFamily = ')) {
    content = content.replace('if (!data) return null;', 'if (!data) return null;\n\n  const fontFamily = customFont || \"\'Inter\', sans-serif\";');
  }

  fs.writeFileSync(filePath, content);
});

console.log("Fixed layouts!");
