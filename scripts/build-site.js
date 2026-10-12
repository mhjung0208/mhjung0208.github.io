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

// data/ 안의 원본 래스터 이미지(PNG/JPG)는 WebP 변환 원본이다.
// 사이트가 실제로 참조하는 파일만 배포하고, 참조되지 않는 원본은 dist 에서 뺀다(저장소에는 그대로 둔다).
const ORIGINAL_IMAGE_EXT = /\.(png|jpe?g)$/i;
const referenceSources = ['index.html', '404.html', 'data/resume.json'];
const referenceDirs = ['css', 'js'];

function listFiles(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.posix.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(rel) : [rel];
  });
}

// 소스 텍스트에서 data/... 이미지 경로를 모은다 (JSON 문자열·HTML 속성·CSS url() 모두 따옴표/괄호로 끝난다)
function collectReferencedImages() {
  const files = [...referenceSources, ...referenceDirs.flatMap(listFiles)]
    .filter((file) => fs.existsSync(path.join(root, file)));
  const refs = new Set();
  const pattern = /data\/[^"'()<>\n]*?\.(?:png|jpe?g|webp|gif|svg)/gi;
  files.forEach((file) => {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    (text.match(pattern) || []).forEach((match) => {
      let ref = match;
      try { ref = decodeURI(match); } catch { /* 인코딩되지 않은 경로는 그대로 */ }
      refs.add(ref);
    });
  });
  return refs;
}

const referencedImages = collectReferencedImages();
const skipped = [];

function shouldSkip(relPath) {
  return relPath.startsWith('data/') && ORIGINAL_IMAGE_EXT.test(relPath) && !referencedImages.has(relPath);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((entry) => copyRecursive(path.join(src, entry), path.join(dest, entry)));
    return;
  }
  const relPath = path.relative(root, src).split(path.sep).join('/');
  if (shouldSkip(relPath)) {
    skipped.push({ relPath, size: stat.size });
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

// 참조된 이미지가 dist 에 모두 있는지 확인한다 (빠진 파일이 있으면 빌드 실패)
const missing = [...referencedImages].filter((ref) => !fs.existsSync(path.join(dist, ref)));
if (missing.length) {
  console.error(`dist 에 없는 참조 이미지:\n${missing.map((ref) => `- ${ref}`).join('\n')}`);
  process.exit(1);
}

const skippedMB = (skipped.reduce((sum, item) => sum + item.size, 0) / 1e6).toFixed(1);
console.log(`static build created: ${path.relative(root, dist)}`);
console.log(`참조 이미지 ${referencedImages.size}개 확인, 참조되지 않은 원본 이미지 ${skipped.length}개(${skippedMB}MB) 제외`);
