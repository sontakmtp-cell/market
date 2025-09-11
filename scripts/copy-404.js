const fs = require('fs');
const path = require('path');

// Copy index.html to 404.html for SPA routing on GitHub Pages
const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');
const notFoundPath = path.join(buildDir, '404.html');

try {
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('✅ 404.html created successfully');
  } else {
    console.log('⚠️  index.html not found, skipping 404.html creation');
  }
} catch (error) {
  console.error('❌ Error creating 404.html:', error.message);
  process.exit(1);
}
