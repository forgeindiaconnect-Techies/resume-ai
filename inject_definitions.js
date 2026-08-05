const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(process.cwd(), 'client/src/components/layouts');
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  if (file === 'ModernLayout.jsx') return; // ModernLayout already has them

  let p = path.join(layoutsDir, file);
  let c = fs.readFileSync(p, 'utf8');

  // Insert declarations if missing
  if (!c.includes('const lineH =')) {
    c = c.replace(/(const fScale = [^;]+;)/, "$1\n  const lineH = lineHeight || 1.6;\n  const spacingPadding = theme?.margin ? `${theme.margin}px` : '2rem';");
  }

  fs.writeFileSync(p, c);
  console.log(`Injected definitions into ${file}`);
});
