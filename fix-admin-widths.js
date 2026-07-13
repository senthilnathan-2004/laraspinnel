const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (filepath.endsWith('.tsx') && !filepath.includes('login')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walk(path.join(__dirname, 'app/admin'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // We are looking for the main container divs that have max-w-4xl, max-w-5xl, or max-w-7xl
  // Pattern: /max-w-(4|5|7)xl mx-auto w-full/
  // We'll replace it with just w-full
  const newContent = content.replace(/max-w-(4|5|7)xl mx-auto /g, '');
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
