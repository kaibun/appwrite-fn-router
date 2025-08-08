// Script to run after Typedoc documentation generation
// It adds sidebar_class_name: docusaurus-hidden to the frontmatter of docs/api/index.md

const fs = require('fs');
const path = require('path');

const apiIndexPath = path.join(__dirname, '../../docs/api/index.md');

if (!fs.existsSync(apiIndexPath)) {
  console.error('index.md file not found:', apiIndexPath);
  process.exit(1);
}

const content = fs.readFileSync(apiIndexPath, 'utf8');
const lines = content.split('\n');

// Find the end of the frontmatter (---)
let frontmatterEnd = -1;
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim() === '---') {
    frontmatterEnd = i;
    break;
  }
}

if (frontmatterEnd === -1) {
  console.error('YAML frontmatter not found in index.md');
  process.exit(1);
}

// Add or replace the sidebar_class_name line
let found = false;
for (let i = 1; i < frontmatterEnd; i++) {
  if (lines[i].startsWith('sidebar_class_name:')) {
    lines[i] = 'sidebar_class_name: docusaurus-hidden';
    found = true;
    break;
  }
}
if (!found) {
  lines.splice(frontmatterEnd, 0, 'sidebar_class_name: docusaurus-hidden');
}

fs.writeFileSync(apiIndexPath, lines.join('\n'));
console.log(
  'Added/patched sidebar_class_name: docusaurus-hidden in docs/api/index.md'
);
