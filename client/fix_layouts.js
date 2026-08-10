const fs = require('fs');
const path = require('path');

const dir = 'd:/Project/Ai builder/Ai builder/client/src/pages/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && !f.includes('Login'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('AdminSidebar')) {
    console.log(`Fixing ${file}...`);
    
    // 1. Add imports
    const importStatements = `
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
`;
    // insert after first import
    content = content.replace(/import React[^;]*;\n/, match => match + importStatements);

    // 2. Wrap <div className="admin-page">
    // Since most components return `<div className="admin-page">...</div>;`
    // We can replace the top level return
    // Let's use regex:
    
    content = content.replace(
      /return \(\s*<div className="admin-page">/g, 
      `return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">`
    );

    // Now we need to close the tags at the end of the return statement
    // The component ends with `    </div>\n  );\n};\n\nexport default`
    content = content.replace(
      /    <\/div>\n  \);\n};\n/g,
      `          </div>
        </main>
      </div>
    </div>
  );
};\n`
    );

    fs.writeFileSync(filePath, content, 'utf-8');
  }
}
console.log('Done');
