// Creates a 404.html for GitHub Pages SPA fallback by copying index.html
// Works cross-platform in CI and local environments.
const fs = require('fs');
const path = require('path');

const OUT_DIR = process.env.OUT_DIR || 'build';
const from = path.join(OUT_DIR, 'index.html');
const to = path.join(OUT_DIR, '404.html');

try {
  if (!fs.existsSync(from)) {
    console.error(`[copy-404] Missing ${from}. Did you run the build?`);
    process.exit(1);
  }
  fs.copyFileSync(from, to);
  console.log(`[copy-404] Created ${to}`);
} catch (err) {
  console.error('[copy-404] Failed to create 404.html', err);
  process.exit(1);
}

