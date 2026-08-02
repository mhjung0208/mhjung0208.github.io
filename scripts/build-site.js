const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const include = [
  'index.html',
  '404.html',
  'css',
  'js',
  'data',
  'assets',
  'robots.txt',
  'sitemap.xml',
  '.nojekyll'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((entry) => copyRecursive(path.join(src, entry), path.join(dest, entry)));
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

include.forEach((entry) => {
  const src = path.join(root, entry);
  if (fs.existsSync(src)) copyRecursive(src, path.join(dist, entry));
});

console.log(`static build created: ${path.relative(root, dist)}`);
