/**
 * Copy the webpack dist/ build to the repo root so GitHub Pages can serve
 * the app from https://trevor-sutherland.github.io/bread-convert/
 * (Pages is configured to publish the master branch root).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
    console.error('dist/ not found. Run the pages build first.');
    process.exit(1);
}

const copied = [];
for (const file of fs.readdirSync(dist)) {
    fs.copyFileSync(path.join(dist, file), path.join(root, file));
    copied.push(file);
}

fs.writeFileSync(path.join(root, '.nojekyll'), '');
copied.push('.nojekyll');

console.log('Synced dist/ → repo root for GitHub Pages:');
console.log(copied.map((f) => `  - ${f}`).join('\n'));
