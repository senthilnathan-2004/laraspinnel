const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '../app/admin');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(adminDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Change md:grid-cols-2 and sm:grid-cols-2 to grid-cols-1
  content = content.replace(/md:grid-cols-2/g, 'md:grid-cols-1');
  content = content.replace(/sm:grid-cols-2/g, 'sm:grid-cols-1');

  // Add noValidate to forms so we don't get the default browser tooltip
  // We'll also remove 'required' attributes from inputs/textareas to be safe
  content = content.replace(/<form\b([^>]*)>/g, (match, p1) => {
    if (!p1.includes('noValidate')) {
      return `<form${p1} noValidate>`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
