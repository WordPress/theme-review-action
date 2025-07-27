const fs = require('fs');
const path = require('path');

if (!fs.existsSync('style.css')) {
  console.log('Missing style.css file');
  process.exit(1);
}

// Check for readme.txt file
const readmePath = path.join(process.cwd(), 'readme.txt');

if (!fs.existsSync(readmePath)) {
  console.log('Error: Missing readme.txt file');
  process.exit(1);
} else {
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  const hasHeader = readmeContent.includes('=== Theme Name ===');

  if (!hasHeader) {
    console.log('Error: readme.txt file is missing "=== Theme Name ===" header');
    process.exit(1);
  } else {
    console.log('✅ readme.txt passed validation.');
  }
}
