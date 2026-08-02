const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function fail(message) {
  errors.push(message);
}

function checkRequiredFiles() {
  [
    'index.html',
    'css/style.css',
    'js/main.js',
    'data/resume.json',
    'assets/favicon.svg',
    'assets/og-image.svg',
    'robots.txt',
    'sitemap.xml'
  ].forEach((file) => {
    if (!exists(file)) fail(`필수 파일이 없습니다: ${file}`);
  });
}

function checkHtml() {
  const html = read('index.html');
  const required = [
    '<html lang="ko">',
    '<meta name="description"',
    'property="og:title"',
    '<script src="js/main.js">'
  ];

  required.forEach((token) => {
    if (!html.includes(token)) fail(`index.html 필수 마크업 누락: ${token}`);
  });

  const navAnchors = ['hero', 'about', 'experience', 'skills', 'projects', 'education', 'contact'];
  navAnchors.forEach((id) => {
    if (!html.includes(`<section id="${id}"`)) fail(`index.html 섹션 누락: #${id}`);
  });
}

function checkData() {
  const data = JSON.parse(read('data/resume.json'));
  if (!data.meta?.title || !data.meta?.description) fail('meta.title/description 정보가 필요합니다.');
  if (!data.contact?.email) fail('연락처 email 정보가 필요합니다.');
  if (!Array.isArray(data.projects) || data.projects.length < 2) fail('프로젝트는 최소 2개 이상 필요합니다.');

  data.projects.forEach((project) => {
    ['name', 'description', 'platform', 'techs', 'image'].forEach((field) => {
      if (!project[field] || (Array.isArray(project[field]) && !project[field].length)) {
        fail(`${project.name || '프로젝트'} 필수 필드 누락: ${field}`);
      }
    });

    if (project.image && !exists(project.image)) fail(`${project.name} 이미지 파일을 찾을 수 없습니다: ${project.image}`);

    (project.links || []).forEach((link) => {
      if (!/^https?:\/\//.test(link.url)) fail(`${project.name} 외부 링크 형식 오류: ${link.url}`);
    });
  });

  data.experience.forEach((item) => {
    if (item.logo && !exists(item.logo)) fail(`${item.company} 로고 파일을 찾을 수 없습니다: ${item.logo}`);
  });
}

function checkCss() {
  const css = read('css/style.css');
  if (!css.trim()) fail('css/style.css가 비어있습니다.');
  ['.fade-in', '.glass-card'].forEach((token) => {
    if (!css.includes(token)) fail(`CSS 필수 클래스 누락: ${token}`);
  });
}

checkRequiredFiles();
checkHtml();
checkData();
checkCss();

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('site validation passed');
