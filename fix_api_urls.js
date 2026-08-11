const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');
const apiConfigPath = path.join(srcDir, 'config', 'api.js');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('http://localhost:5000/api')) {
    // Calculate relative path to api.js
    let relativePath = path.relative(path.dirname(file), path.dirname(apiConfigPath)).replace(/\\/g, '/');
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    const importPath = `${relativePath}/api`;
    
    // Add import if not exists
    if (!content.includes('API_BASE_URL')) {
      // Find the last import statement or put it at the top
      const lines = content.split('\n');
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      const importStatement = `import { API_BASE_URL } from "${importPath}";`;
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, importStatement);
      } else {
        lines.unshift(importStatement);
      }
      content = lines.join('\n');
    }

    // Replace the URLs
    // Example: "http://localhost:5000/api/admin/dashboard" -> `${API_BASE_URL}/admin/dashboard`
    // Example: `http://localhost:5000/api/admin/templates/${id}` -> `${API_BASE_URL}/admin/templates/${id}`
    
    content = content.replace(/"http:\/\/localhost:5000\/api([^"]*)"/g, '`${API_BASE_URL}$1`');
    content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, '`${API_BASE_URL}$1`');
    content = content.replace(/`http:\/\/localhost:5000\/api([^`]+)`/g, '`${API_BASE_URL}$1`');
    content = content.replace(/`http:\/\/localhost:5000\/api`/g, '`${API_BASE_URL}`');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done.');
