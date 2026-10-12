// data/Images 아래 PNG/JPG 원본을 그대로 두고 WebP 사본을 옆에 만든다.
//   <이름>.webp      — 갤러리·라이트박스용 (가로 최대 1600px)
//   <이름>-640.webp  — 프로젝트 카드·썸네일용 (가로 640px)
// 사용법: npm run images  (원본보다 새 WebP 가 이미 있으면 건너뜀, --force 로 전체 재생성)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const imageDir = path.join(root, 'data', 'Images');
const force = process.argv.includes('--force');
const variants = [
  { suffix: '', width: 1600, quality: 80 },
  { suffix: '-640', width: 640, quality: 76 }
];

function collectSources(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectSources(full);
    return /\.(png|jpe?g)$/i.test(entry.name) ? [full] : [];
  });
}

function isFresh(src, dest) {
  return !force && fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs;
}

async function convert(src) {
  const base = src.replace(/\.(png|jpe?g)$/i, '');
  const results = [];
  for (const variant of variants) {
    const dest = `${base}${variant.suffix}.webp`;
    if (!isFresh(src, dest)) {
      await sharp(src)
        .resize({ width: variant.width, withoutEnlargement: true })
        .webp({ quality: variant.quality, effort: 5 })
        .toFile(dest);
    }
    results.push(fs.statSync(dest).size);
  }
  return { src, before: fs.statSync(src).size, after: results };
}

(async () => {
  const sources = collectSources(imageDir);
  let before = 0;
  let afterFull = 0;
  let afterThumb = 0;
  for (const src of sources) {
    const r = await convert(src);
    before += r.before;
    afterFull += r.after[0];
    afterThumb += r.after[1];
  }
  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
  console.log(`원본 ${sources.length}개 ${mb(before)}MB → WebP 1600px ${mb(afterFull)}MB, 640px ${mb(afterThumb)}MB`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
