document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initScrollTop();

  const data = await loadResumeData();
  if (data) renderAll(data);
});

async function loadResumeData() {
  try {
    const res = await fetch('data/resume.json');
    return await res.json();
  } catch (e) {
    console.error('resume.json 로드 실패:', e);
    return null;
  }
}

function renderAll(data) {
  // 경력 기간은 experience 재직 기간 합계 하나로 계산해 Hero·소개·경력 섹션에 같은 값을 쓴다
  const career = calcTotalCareer(data.experience);
  renderMeta(data.meta, data.hero);
  renderHero(data.hero, data.experience, data.contact, career);
  renderAbout(data.about, career);
  renderSkills(data.skills);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderContact(data.contact);
  renderFooter(data.hero.name);
}

// 사용자 모션 설정(reduced motion)을 따른다
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── 이미지 경로 도우미 ──
// scripts/optimize-images.js 가 만든 WebP 쌍(<이름>.webp 1600px, <이름>-640.webp 640px)을 오간다.
function toLargeSrc(src) {
  return String(src || '').replace(/-640\.webp$/, '.webp');
}

function toThumbSrc(src) {
  const value = String(src || '');
  return /\.webp$/.test(value) && !/-640\.webp$/.test(value) ? value.replace(/\.webp$/, '-640.webp') : value;
}

// 썸네일(-640)과 큰 이미지를 srcset 으로 묶는다. WebP 쌍이 아니면 src 하나만 쓴다.
function responsiveImgAttrs(src, sizes) {
  const value = String(src || '');
  if (!/\.webp$/.test(value)) return `src="${escapeHtml(value)}"`;
  const small = toThumbSrc(value);
  const large = toLargeSrc(value);
  // srcset 은 공백으로 후보를 나누므로 파일명의 공백("01. Mad Forest")을 인코딩한다
  const srcsetUrl = url => escapeHtml(encodeURI(url));
  return `src="${escapeHtml(small)}" srcset="${srcsetUrl(small)} 640w, ${srcsetUrl(large)} 1600w" sizes="${sizes}"`;
}

function renderMeta(meta, hero) {
  // index.html 에 정적 메타가 있으므로 값이 있을 때만 덮어쓴다
  if (meta.title) document.title = meta.title;
  const setContent = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && value) el.content = value;
  };
  setContent('meta[name="description"]', meta.description);
  setContent('meta[property="og:title"]', meta.title);
  setContent('meta[property="og:description"]', meta.description);
  setContent('meta[property="og:image"]', meta.ogImage);
  setContent('meta[property="og:url"]', meta.url);
  document.getElementById('nav-logo').textContent = `${hero.name} 포트폴리오`;
}

// "2017.02.13 - 2022.01.22" → { start: 2017, end: 2022 }
function periodYears(period) {
  const [start, end] = String(period || '').split(' - ');
  return { start: (start || '').slice(0, 4), end: (end || '').slice(0, 4) };
}

function renderHero(hero, experience, contact, career) {
  // 재직 이력: 회사명과 연도만 짧게
  const careerHtml = (experience || []).map(exp => {
    const y = periodYears(exp.period);
    return `<li><span class="text-gray-900 font-medium">${escapeHtml(exp.company)}</span> <span class="hero-years">${escapeHtml(y.start)}–${escapeHtml(y.end)}</span></li>`;
  }).join('');

  const roleLine = hero.role || hero.title;
  const size = hero.profileImageSize || [];
  const sizeAttrs = size.length === 2 ? ` width="${size[0]}" height="${size[1]}"` : '';
  const imageHtml = hero.profileImage ? `
    <div class="hero-figure">
      <img ${responsiveImgAttrs(hero.profileImage, '(min-width: 1024px) 34vw, 60vw')}${sizeAttrs}
           alt="노트북으로 Unity 작업을 하는 ${escapeHtml(hero.name)} 일러스트" loading="eager" fetchpriority="high" decoding="async">
    </div>` : '';

  document.getElementById('hero-content').innerHTML = `
    <div class="hero-grid">
      <div class="hero-text fade-in">
        <h1 class="hero-name">${escapeHtml(hero.name)}</h1>
        <p class="hero-role">${escapeHtml(roleLine)}</p>

        <div class="hero-actions">
          <a href="#projects" class="btn btn-primary">프로젝트 보기</a>
        </div>

        <dl class="hero-facts">
          ${careerHtml ? `<div><dt>경력</dt><dd>${career.label ? `<p class="hero-career-total">총 경력 <strong>${escapeHtml(career.label)}</strong></p>` : ''}<ul class="hero-inline-list">${careerHtml}</ul></dd></div>` : ''}
          ${contact?.email ? `<div><dt>연락처</dt><dd><a class="text-link" href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></dd></div>` : ''}
        </dl>
      </div>
      ${imageHtml}
    </div>
  `;
}

function renderAbout(about, career) {
  // 하이라이트 문구의 {career} 는 재직 기간 합계("8년 9개월")로 바꾼다
  const highlightsHtml = about.highlights
    .map(h => `<li>${escapeHtml(String(h).replace('{career}', career.label))}</li>`)
    .join('');

  const profileImageHtml = about.profileImage
    ? `<img src="${escapeHtml(about.profileImage)}" alt="정민화 증명사진" width="160" height="200" class="about-photo" loading="lazy" decoding="async">`
    : '';

  document.getElementById('about-content').innerHTML = `
    <div class="about-grid">
      ${profileImageHtml}
      <div>
        <p class="about-text">${about.description}</p>
        <ul class="about-highlights">${highlightsHtml}</ul>
      </div>
    </div>
  `;
}

// 자기평가 % 대신 범주별 기술 이름만 보여준다 (level 값은 데이터에 남겨 둠)
function renderSkills(skills) {
  const groupsHtml = skills.map(cat => `
    <div class="skill-group">
      <dt>${escapeHtml(cat.category)}</dt>
      <dd>
        <ul class="tag-list">
          ${cat.items.map(item => `<li>${escapeHtml(item.name)}</li>`).join('')}
        </ul>
      </dd>
    </div>
  `).join('');

  document.getElementById('skills-content').innerHTML = `<dl class="skill-groups">${groupsHtml}</dl>`;
}

function calcWorkDuration(period) {
  const parts = period.split(' - ');
  if (parts.length !== 2) return '';
  const parseDate = s => { const [y, m, d] = s.split('.').map(Number); return new Date(y, m - 1, d || 1); };
  const start = parseDate(parts[0]);
  const end = parseDate(parts[1]);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) { years--; months += 12; }
  const result = [];
  if (years > 0) result.push(`${years}년`);
  if (months > 0) result.push(`${months}개월`);
  return result.length ? `(${result.join(' ')})` : '';
}

// calcWorkDuration 과 같은 규칙으로 개월 수만 돌려준다 (경력 합계 계산용)
function calcWorkMonths(period) {
  const parts = period.split(' - ');
  if (parts.length !== 2) return 0;
  const parseDate = s => { const [y, m, d] = s.split('.').map(Number); return new Date(y, m - 1, d || 1); };
  const start = parseDate(parts[0]);
  const end = parseDate(parts[1]);
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

// 재직 기간 합계 → { months: 105, label: "8년 9개월" }
function calcTotalCareer(experience) {
  const months = (experience || []).reduce((sum, exp) => sum + calcWorkMonths(exp.period), 0);
  const y = Math.floor(months / 12);
  const m = months % 12;
  const label = [y ? `${y}년` : '', m ? `${m}개월` : ''].filter(Boolean).join(' ');
  return { months, label };
}

function renderExperience(experience) {
  const itemsHtml = experience.map((exp, i) => {
    const highlightsHtml = exp.highlights
      .map(h => `<li>${escapeHtml(h)}</li>`)
      .join('');
    const duration = calcWorkDuration(exp.period);

    return `
      <li class="relative pl-8 pb-12 last:pb-0">
        <div class="absolute left-0 top-0 bottom-0 w-px timeline-line" aria-hidden="true"></div>
        <div class="absolute -left-[5px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-accent ${i === 0 ? 'bg-accent' : 'bg-warm-50'}" aria-hidden="true"></div>
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
          <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            ${exp.logo ? `<img src="${escapeHtml(exp.logo)}" alt="" width="32" height="32" class="w-8 h-8 object-contain rounded-md flex-shrink-0" onerror="this.style.display='none'">` : ''}
            ${escapeHtml(exp.company)}
          </h3>
          <p class="sm:text-right tabular-nums">
            <span class="block text-[15px] font-semibold text-accent-ink">${escapeHtml(exp.period)}</span>
            ${duration ? `<span class="block text-sm text-gray-600">${duration}</span>` : ''}
          </p>
        </div>
        <p class="text-[15px] font-medium text-gray-700 mb-1">${escapeHtml(exp.role)}</p>
        <p class="text-[15px] text-gray-600 mb-3">${escapeHtml(exp.description)}</p>
        <ul class="exp-highlights">${highlightsHtml}</ul>
      </li>
    `;
  }).join('');

  const total = calcTotalCareer(experience);
  const totalHtml = total.months > 0
    ? `<p class="exp-total max-w-3xl"><span class="exp-total-label">총 경력</span> <strong>${escapeHtml(total.label)}</strong></p>`
    : '';
  document.getElementById('experience-content').innerHTML = `${totalHtml}<ol class="max-w-3xl">${itemsHtml}</ol>`;
}

function projectMetaHtml(proj) {
  const d = proj.details || {};
  if (!d.company && !d.period) return '';
  return `
    <p class="project-meta">
      ${d.company ? `<span>${escapeHtml(d.company)}</span>` : ''}
      ${d.period ? `<span class="tabular-nums">${escapeHtml(d.period)}</span>` : ''}
    </p>`;
}

function projectThumbHtml(proj, sizes, extraClass) {
  const src = proj.image || (proj.details?.images?.[0] || '');
  if (!src) return `<div class="${extraClass} project-thumb-empty" aria-hidden="true"></div>`;
  return `
    <div class="${extraClass}">
      <img ${responsiveImgAttrs(src, sizes)} alt="" loading="lazy" decoding="async"
           onload="if (this.naturalWidth / this.naturalHeight > 2.2) this.classList.add('is-wide')" onerror="this.style.opacity=0">
    </div>`;
}

// 카드에 보여줄 기술 태그 수. 나머지는 "+N" 으로 줄이고 전체 목록은 모달에서 본다
const CARD_TAG_LIMIT = 4;

function projectTagsHtml(techs) {
  const shown = techs.slice(0, CARD_TAG_LIMIT);
  const rest = techs.length - shown.length;
  return `
    <ul class="tag-list tag-list-sm">
      ${shown.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
      ${rest > 0 ? `<li class="tag-more"><span aria-hidden="true">+${rest}</span><span class="sr-only">외 ${rest}개</span></li>` : ''}
    </ul>`;
}

// 모든 프로젝트를 resume.json 순서(최신순) 그대로 같은 가로형 카드로 보여준다
function renderProjects(projects) {
  const cardsHtml = projects.map((proj, idx) => `
    <li class="project-card glass-card">
      ${projectThumbHtml(proj, '(min-width: 768px) 560px, 100vw', 'project-card-media')}
      <div class="project-card-text">
        ${projectMetaHtml(proj)}
        <h3 class="project-card-title">
          <button type="button" class="project-open" data-project-idx="${idx}">${escapeHtml(proj.name)}</button>
        </h3>
        <p class="project-desc">${escapeHtml(proj.description)}</p>
        ${projectTagsHtml(proj.techs)}
        <span class="project-more" aria-hidden="true">${proj.caseStudy ? '케이스 스터디 읽기' : '자세히 보기'}</span>
      </div>
    </li>`).join('');

  document.getElementById('projects-content').innerHTML = `<ul class="project-list">${cardsHtml}</ul>`;

  document.querySelectorAll('#projects-content [data-project-idx]').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(projects[Number(btn.dataset.projectIdx)]));
  });
}

// ── 프로젝트 모달 ──
let modalReturnFocus = null;
let lightboxOpen = false;

function openProjectModal(proj) {
  const d = proj.details || {};
  modalReturnFocus = document.activeElement;

  function renderNestedList(items, level) {
    if (!items || !items.length) return '';
    const markers = ['•', '◦', '▪'];
    const marker = markers[Math.min(level, 2)];
    const indent = level * 16;
    return items.map(item => {
      const text = typeof item === 'string' ? item : item.text;
      const children = typeof item === 'object' ? (item.children || []) : [];
      return `
        <div style="padding-left:${indent}px" class="flex items-start gap-2 mb-1.5">
          <span class="notion-bullet text-gray-500 mt-0.5 flex-shrink-0 select-none" aria-hidden="true">${marker}</span>
          <span class="modal-text">${text}</span>
        </div>
        ${children.length ? renderNestedList(children, level + 1) : ''}
      `;
    }).join('');
  }

  const techTagsHtml = proj.techs
    .map(t => `<li>${escapeHtml(t)}</li>`)
    .join('');

  const propertiesHtml = `
    <dl class="modal-props">
      ${d.company ? `<div><dt>소속</dt><dd>${escapeHtml(d.company)}</dd></div>` : ''}
      ${d.period ? `<div><dt>기간</dt><dd class="tabular-nums">${escapeHtml(d.period)}</dd></div>` : ''}
      ${d.role ? `<div><dt>역할</dt><dd>${escapeHtml(d.role)}</dd></div>` : ''}
      <div><dt>기술</dt><dd><ul class="tag-list tag-list-sm">${techTagsHtml}</ul></dd></div>
    </dl>
  `;

  const linksSection = (proj.links || []).length ? `
    <div class="notion-section mb-8">
      <h3 class="modal-subtitle">관련 링크</h3>
      <ul class="space-y-1.5">
        ${proj.links.map(link => `
          <li><a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" class="text-link break-all">${escapeHtml(link.title)}</a></li>
        `).join('')}
      </ul>
    </div>` : '';

  const introItems = d.intro || [];
  const galleryImages = ((d.images || []).length ? d.images : (proj.image ? [proj.image] : [])).map(toLargeSrc);
  const galleryHtml = galleryImages.length ? buildGalleryHtml(galleryImages, proj.name) : '';

  const imageSection = galleryImages.length ? `<div class="mb-8">${galleryHtml}</div>` : '';

  const introSection = introItems.length ? `
    <div class="notion-section mb-8">
      <h3 class="modal-subtitle">프로젝트 소개</h3>
      <ul class="modal-list">
        ${introItems.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>` : '';

  const features = d.features || [];
  const featuresSection = features.length ? `
    <div class="notion-section mb-8">
      <h3 class="modal-subtitle">담당 기능</h3>
      <div>${renderNestedList(features, 0)}</div>
    </div>` : '';

  // caseStudy 필드가 있는 프로젝트만 케이스 스터디 레이아웃(넓은 모달 + 섹션 구성)으로 렌더링
  const caseStudy = proj.caseStudy;
  const modalWidthClass = caseStudy ? 'max-w-4xl' : 'max-w-3xl';
  const bodyHtml = caseStudy
    ? renderCaseStudy(caseStudy, galleryImages, proj.name) + linksSection
    : `${imageSection}
          ${introSection}
          ${featuresSection}
          ${linksSection}`;

  const container = document.getElementById('project-modal');
  container.innerHTML = `
    <div class="project-modal-overlay fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-3 sm:p-4" id="modal-overlay">
      <div class="project-modal-box bg-white rounded-xl w-full ${modalWidthClass} max-h-[92vh] overflow-y-auto shadow-2xl"
           role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <div class="modal-bar">
          <div id="modal-toc" class="modal-toc"></div>
          <button type="button" id="modal-close" class="modal-close" aria-label="닫기">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="px-5 sm:px-10 pb-12 pt-3">
          <h2 id="modal-title" class="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
            ${escapeHtml(proj.name)}
          </h2>

          ${propertiesHtml}

          <hr class="border-warm-200 mb-8">

          ${bodyHtml}
        </div>
      </div>
    </div>
  `;

  const box = container.querySelector('.project-modal-box');
  initGallery(container);
  if (caseStudy) {
    initCaseStudyFigures(container);
    initCaseStudyToc(box);
  }

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeProjectModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', onModalKeydown);
  document.body.style.overflow = 'hidden';
  setPageInert(true);
  document.getElementById('modal-close').focus();
}

// 모달이 열려 있는 동안 배경(내비·본문·푸터)을 inert 로 막는다
function setPageInert(isInert) {
  ['navbar', 'main', 'scroll-top'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.inert = isInert;
  });
  const footer = document.querySelector('footer');
  if (footer) footer.inert = isInert;
}

// 컨테이너 안에서 Tab/Shift+Tab 이 순환하도록 한다
function trapFocus(e, container) {
  if (e.key !== 'Tab') return;
  const focusables = [...container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
    e.preventDefault();
    first.focus();
  }
}

// 케이스 스터디 섹션 목차(모달 상단 sticky 칩)
function initCaseStudyToc(box) {
  const toc = box.querySelector('#modal-toc');
  const sections = [...box.querySelectorAll('.cs-section')];
  if (!toc || sections.length < 3) return;

  const chips = sections.map((section, i) => {
    section.id = `cs-section-${i + 1}`;
    const title = section.querySelector('.cs-section-title');
    const label = title ? [...title.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('cs-section-num'))).map(n => n.textContent).join('').trim() : `섹션 ${i + 1}`;
    return `<button type="button" class="toc-chip" data-target="${section.id}">${escapeHtml(label)}</button>`;
  }).join('');
  toc.innerHTML = `<nav aria-label="케이스 스터디 목차"><div class="toc-track">${chips}</div></nav>`;

  const buttons = [...toc.querySelectorAll('.toc-chip')];
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = box.querySelector(`#${btn.dataset.target}`);
      if (!target) return;
      target.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });

  // 현재 읽는 섹션의 칩을 표시
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      buttons.forEach(btn => {
        const active = btn.dataset.target === entry.target.id;
        btn.classList.toggle('active', active);
        if (active) btn.setAttribute('aria-current', 'true'); else btn.removeAttribute('aria-current');
      });
    });
  }, { root: box, rootMargin: '-15% 0px -75% 0px' });
  sections.forEach(section => observer.observe(section));

  // 맨 위(첫 섹션 이전)로 돌아오면 활성 표시를 지운다
  box.addEventListener('scroll', () => {
    if (sections[0].getBoundingClientRect().top - box.getBoundingClientRect().top > box.clientHeight * 0.15) {
      buttons.forEach(btn => { btn.classList.remove('active'); btn.removeAttribute('aria-current'); });
    }
  }, { passive: true });
}

// ── 케이스 스터디(시니어 포트폴리오형) 프로젝트 모달 ─────────────────────────
// resume.json 의 projects[].caseStudy 가 있을 때만 사용한다.
// caseStudy 문자열은 escape 후 삽입하고, `백틱`으로 감싼 부분만 인라인 코드로 표시한다.

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCaseText(value) {
  return escapeHtml(value).replace(/`([^`]+)`/g, '<code class="cs-code">$1</code>');
}

function renderCaseFigures(figures) {
  if (!figures || !figures.length) return '';
  const gridClass = figures.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : '';
  return `
    <div class="${gridClass} mt-5">
      ${figures.map(fig => `
        <figure class="cs-figure${fig.wide ? ' cs-figure-wide sm:col-span-2' : ''}">
          <button type="button" class="cs-figure-btn" data-src="${escapeHtml(fig.src)}" aria-label="이미지 크게 보기">
            <img src="${escapeHtml(fig.src)}" alt="${escapeHtml(fig.caption || '')}" loading="lazy" onerror="this.style.opacity=0">
          </button>
          ${fig.caption ? `<figcaption>${formatCaseText(fig.caption)}</figcaption>` : ''}
        </figure>`).join('')}
    </div>`;
}

function renderCaseTable(table) {
  const headers = table.headers || [];
  const rows = table.rows || [];
  return `
    <div class="mb-6">
      ${table.caption ? `<p class="text-sm font-semibold text-gray-800 mb-2">${formatCaseText(table.caption)}</p>` : ''}
      <div class="cs-table-wrap">
        <table class="cs-table">
          <thead><tr>${headers.map(h => `<th>${formatCaseText(h)}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${formatCaseText(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      ${table.note ? `<p class="text-xs text-gray-500 mt-2 leading-relaxed">${formatCaseText(table.note)}</p>` : ''}
    </div>`;
}

function renderCaseLabelRows(items) {
  return `
    <dl class="cs-rows">
      ${items.map(item => `
        <div class="cs-row">
          <dt>${formatCaseText(item.label)}</dt>
          <dd>${formatCaseText(item.value ?? item.text)}</dd>
        </div>`).join('')}
    </dl>`;
}

// 라벨 없는 한 열 문단. body(문자열 배열)가 있는 카드에서만 쓴다.
function renderCaseBody(paragraphs) {
  return `
    <div class="cs-body">
      ${paragraphs.map(text => `<p>${formatCaseText(text)}</p>`).join('')}
    </div>`;
}

function renderCaseBulletList(items) {
  return `
    <ul class="space-y-1.5">
      ${items.map(text => `
        <li class="flex items-start gap-2">
          <span class="text-accent mt-0.5 select-none" aria-hidden="true">•</span>
          <span class="modal-text">${formatCaseText(text)}</span>
        </li>`).join('')}
    </ul>`;
}

function renderCaseStudy(cs, fallbackImages, projectName) {
  // variant: "linear" 는 카드·그리드 없는 일자형 레이아웃으로 따로 렌더링(기존 출력은 그대로)
  if (cs.variant === 'linear') return renderCaseStudyLinear(cs, fallbackImages, projectName);
  const figures = cs.figures || {};
  const sections = [];

  // 섹션 순서 정의: 데이터가 있는 섹션만 번호를 매겨 렌더링
  if (cs.overview) {
    const ov = cs.overview;
    const galleryImages = (cs.gallery && cs.gallery.length) ? cs.gallery : fallbackImages;
    const kpis = ov.kpis || [];
    sections.push({
      title: '한눈에 보기',
      html: `
        ${ov.summary ? `<p class="text-gray-700 text-[15px] leading-relaxed mb-5">${formatCaseText(ov.summary)}</p>` : ''}
        ${kpis.length ? `
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            ${kpis.map(k => `
              <div class="cs-kpi">
                <div class="cs-kpi-value">${formatCaseText(k.value)}</div>
                <div class="text-xs font-medium text-gray-700 mt-1 leading-snug">${formatCaseText(k.label)}</div>
                ${k.note ? `<div class="text-[11px] text-gray-500 mt-1 leading-snug">${formatCaseText(k.note)}</div>` : ''}
              </div>`).join('')}
          </div>` : ''}
        ${ov.kpiNote ? `<p class="text-xs text-gray-500 leading-relaxed mb-5">${formatCaseText(ov.kpiNote)}</p>` : ''}
        ${galleryImages.length ? buildGalleryHtml(galleryImages, projectName) : ''}
        ${renderCaseFigures(figures.overview)}`
    });
  }

  if ((cs.environment || []).length) {
    sections.push({
      title: '개발 환경 및 조건',
      html: `${renderCaseLabelRows(cs.environment)}${renderCaseFigures(figures.environment)}`
    });
  }

  if ((cs.timeline || []).length) {
    sections.push({
      title: '개발 과정',
      html: `
        <ol class="cs-timeline">
          ${cs.timeline.map(t => `
            <li class="cs-timeline-item">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-accent-ink">${formatCaseText(t.period)}</span>
                ${t.commits != null ? `<span class="text-[11px] px-1.5 py-0.5 rounded bg-warm-100 text-gray-500">커밋 ${escapeHtml(t.commits)}</span>` : ''}
              </div>
              <p class="text-sm font-semibold text-gray-800 mb-1">${formatCaseText(t.title)}</p>
              ${t.desc ? `<p class="text-sm text-gray-600 leading-relaxed">${formatCaseText(t.desc)}</p>` : ''}
              ${t.decision ? `<p class="text-xs text-gray-500 mt-1.5 leading-relaxed"><span class="font-semibold text-gray-700">핵심 결정</span> · ${formatCaseText(t.decision)}</p>` : ''}
            </li>`).join('')}
        </ol>
        ${cs.timelineNote ? `<p class="text-xs text-gray-500 mt-3 leading-relaxed">${formatCaseText(cs.timelineNote)}</p>` : ''}
        ${renderCaseFigures(figures.timeline)}`
    });
  }

  if (cs.architecture || (cs.systems || []).length) {
    const systems = cs.systems || [];
    sections.push({
      title: '시스템 설계',
      html: `
        ${cs.architecture ? `<p class="text-sm text-gray-700 leading-relaxed mb-5">${formatCaseText(cs.architecture)}</p>` : ''}
        <div class="cs-systems-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          ${systems.map(s => `
            <div class="cs-card">
              <p class="text-sm font-semibold text-gray-900 mb-2.5">${formatCaseText(s.name)}</p>
              ${(s.body || []).length ? renderCaseBody(s.body) : `
              ${s.problem ? `<p class="cs-field"><span class="cs-field-label">문제</span>${formatCaseText(s.problem)}</p>` : ''}
              ${s.decision ? `<p class="cs-field"><span class="cs-field-label">설계</span>${formatCaseText(s.decision)}</p>` : ''}
              ${s.tradeoff ? `<p class="cs-field"><span class="cs-field-label">트레이드오프</span>${formatCaseText(s.tradeoff)}</p>` : ''}`}
            </div>`).join('')}
        </div>
        ${renderCaseFigures(figures.systems)}`
    });
  }

  if (cs.results) {
    const r = cs.results;
    const stats = r.stats || [];
    sections.push({
      title: '결과',
      html: `
        ${stats.length ? `
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            ${stats.map(st => `
              <div class="rounded-lg border border-warm-200 bg-warm-50 px-3 py-2.5">
                <div class="text-[11px] text-gray-500">${formatCaseText(st.label)}</div>
                <div class="text-sm font-semibold text-gray-800 mt-0.5">${formatCaseText(st.value)}</div>
              </div>`).join('')}
          </div>` : ''}
        ${(r.items || []).length ? renderCaseBulletList(r.items) : ''}
        ${r.limits ? `<p class="text-xs text-gray-500 mt-4 leading-relaxed"><span class="font-semibold text-gray-700">알려진 한계</span> · ${formatCaseText(r.limits)}</p>` : ''}
        ${renderCaseFigures(figures.results)}`
    });
  }

  if ((cs.troubleshooting || []).length) {
    const fieldDefs = [
      ['symptom', '증상'],
      ['cause', '원인'],
      ['solution', '해결'],
      ['result', '결과']
    ];
    sections.push({
      title: '트러블슈팅',
      html: `
        <div class="space-y-4">
          ${cs.troubleshooting.map((t, i) => `
            <div class="cs-card">
              <p class="text-sm font-semibold text-gray-900 mb-3"><span class="text-accent-ink mr-1.5">#${i + 1}</span>${formatCaseText(t.title)}</p>
              ${(t.body || []).length ? renderCaseBody(t.body) : `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1">
                ${fieldDefs.filter(([key]) => t[key]).map(([key, label]) => `
                  <p class="cs-field"><span class="cs-field-label">${label}</span>${formatCaseText(t[key])}</p>`).join('')}
              </div>`}
              ${t.image ? renderCaseFigures([{ src: t.image, caption: t.caption }]) : ''}
            </div>`).join('')}
        </div>
        ${renderCaseFigures(figures.troubleshooting)}`
    });
  }

  if (cs.performance) {
    const p = cs.performance;
    sections.push({
      title: '성능 검증',
      html: `
        ${(p.method || []).length ? `
          <p class="text-sm font-semibold text-gray-800 mb-2">측정 방법과 조건</p>
          <div class="mb-6">${renderCaseLabelRows(p.method)}</div>` : ''}
        ${(p.tables || []).map(renderCaseTable).join('')}
        ${(p.insights || []).length ? `
          <p class="text-sm font-semibold text-gray-800 mb-2">해석</p>
          <div class="mb-6">${renderCaseBulletList(p.insights)}</div>` : ''}
        ${renderCaseFigures(figures.performance)}
        ${(p.validation || []).length ? `
          <p class="text-sm font-semibold text-gray-800 mt-6 mb-2">기능 검증 방식 (자동 테스트 대체)</p>
          ${renderCaseLabelRows(p.validation)}` : ''}`
    });
  }

  if ((cs.retrospective || []).length) {
    sections.push({
      title: '회고',
      html: `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${cs.retrospective.map(group => `
            <div class="cs-card">
              <p class="text-sm font-semibold text-gray-900 mb-2">${formatCaseText(group.label)}</p>
              ${renderCaseBulletList(group.items || [])}
            </div>`).join('')}
        </div>
        ${renderCaseFigures(figures.retrospective)}`
    });
  }

  return sections.map((section, i) => `
    <section class="cs-section">
      <h3 class="cs-section-title">
        <span class="cs-section-num">${String(i + 1).padStart(2, '0')}</span>
        ${section.title}
      </h3>
      ${section.html}
    </section>`).join('');
}

// ── 일자형 케이스 스터디(caseStudy.variant === 'linear') ──
// 카드 박스·KPI 카드·2열 그리드 없이 "섹션 제목 + 소제목 + 본문" 한 열 흐름으로 그린다.
// 본문(body)은 문자열 또는 문자열 배열을 받는다.
function renderCaseStudyLinear(cs, fallbackImages, projectName) {
  const figures = cs.figures || {};
  const sections = [];
  const paras = value => [].concat(value || []);
  // 이미지는 그리드 없이 한 장씩 세로로 쌓는다
  const figs = list => (list || []).map(fig => renderCaseFigures([fig])).join('');
  const block = (title, meta, body) => `
    <div class="cs-linear-block">
      ${title ? `<h4 class="cs-linear-sub">${formatCaseText(title)}</h4>` : ''}
      ${meta ? `<p class="cs-linear-meta">${formatCaseText(meta)}</p>` : ''}
      ${paras(body).length ? renderCaseBody(paras(body)) : ''}
    </div>`;
  const note = text => text ? `<p class="cs-linear-note">${formatCaseText(text)}</p>` : '';

  if (cs.overview) {
    const ov = cs.overview;
    const galleryImages = (cs.gallery && cs.gallery.length) ? cs.gallery : fallbackImages;
    const stats = ov.stats || [];
    sections.push({
      title: '개요',
      html: `
        ${ov.summary ? `<p class="cs-linear-lead">${formatCaseText(ov.summary)}</p>` : ''}
        ${stats.length ? `
          <ul class="cs-linear-stats">
            ${stats.map(st => `<li><strong>${formatCaseText(st.value)}</strong>${formatCaseText(st.label)}</li>`).join('')}
          </ul>` : ''}
        ${note(ov.note)}
        ${galleryImages.length ? buildGalleryHtml(galleryImages, projectName) : ''}
        ${figs(figures.overview)}`
    });
  }

  if ((cs.environment || []).length) {
    sections.push({
      title: '개발 환경과 조건',
      html: `${renderCaseLabelRows(cs.environment)}${figs(figures.environment)}`
    });
  }

  if ((cs.timeline || []).length) {
    sections.push({
      title: '개발 과정',
      html: `
        ${cs.timeline.map(t => {
          const meta = [t.period, t.commits != null ? `커밋 ${t.commits}개` : '', t.days != null ? `커밋한 날 ${t.days}일` : '']
            .filter(Boolean).join(', ');
          return block(t.title, meta, t.desc);
        }).join('')}
        ${note(cs.timelineNote)}
        ${figs(figures.timeline)}`
    });
  }

  if (cs.architecture || (cs.systems || []).length) {
    sections.push({
      title: '시스템 설계',
      html: `
        ${paras(cs.architecture).length ? block('', '', cs.architecture) : ''}
        ${(cs.systems || []).map(s => block(s.name, '', s.body) + figs(s.figures)).join('')}
        ${paras(cs.systemsNote).length ? block('', '', cs.systemsNote) : ''}
        ${figs(figures.systems)}`
    });
  }

  if (cs.results) {
    const r = cs.results;
    sections.push({
      title: '결과',
      html: `
        ${block('', '', r.body)}
        ${r.limits ? block('알려진 한계', '', r.limits) : ''}
        ${figs(figures.results)}`
    });
  }

  if ((cs.troubleshooting || []).length) {
    sections.push({
      title: '트러블슈팅',
      html: `
        ${cs.troubleshooting.map(t => block(t.title, '', t.body)).join('')}
        ${figs(figures.troubleshooting)}`
    });
  }

  if (cs.performance) {
    const p = cs.performance;
    sections.push({
      title: '성능 검증',
      html: `
        ${paras(p.body).length ? `<div class="mb-5">${renderCaseBody(paras(p.body))}</div>` : ''}
        ${(p.tables || []).map(renderCaseTable).join('')}
        ${paras(p.insights).length ? renderCaseBody(paras(p.insights)) : ''}
        ${figs(figures.performance)}`
    });
  }

  if ((cs.retrospective || []).length) {
    sections.push({
      title: '회고',
      html: `${renderCaseBulletList(cs.retrospective)}${figs(figures.retrospective)}`
    });
  }

  return `
    <div class="cs-linear">
      ${sections.map((section, i) => `
        <section class="cs-section">
          <h3 class="cs-section-title">
            <span class="cs-section-num">${String(i + 1).padStart(2, '0')}</span>
            ${section.title}
          </h3>
          ${section.html}
        </section>`).join('')}
    </div>`;
}

// 케이스 스터디 인라인 이미지 클릭 시 라이트박스(모달 내 모든 figure 를 순서대로 탐색)
function initCaseStudyFigures(container) {
  const buttons = [...container.querySelectorAll('.cs-figure-btn')];
  if (!buttons.length) return;
  const srcs = buttons.map(btn => btn.querySelector('img')?.src).filter(Boolean);
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => openLightbox(srcs, i));
  });
}

function buildGalleryHtml(images, name) {
  const multi = images.length > 1;
  const safeName = escapeHtml(name);
  const slidesHtml = images.map((src, i) => `
    <div class="img-slider-slide" data-idx="${i}">
      <img src="${escapeHtml(src)}" alt="${safeName} 화면 ${i + 1}" loading="lazy" decoding="async" onerror="this.style.opacity=0">
    </div>`).join('');
  const btnsHtml = multi ? `
    <button type="button" class="img-slider-btn prev" aria-label="이전 이미지">
      <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <button type="button" class="img-slider-btn next" aria-label="다음 이미지">
      <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>` : '';
  // 썸네일 줄은 640px 사본을 쓴다
  const thumbsHtml = multi ? `
    <div class="img-thumbs">
      ${images.map((src, i) => `
        <button type="button" class="img-thumb${i === 0 ? ' active' : ''}" data-idx="${i}" style="background-image:url('${escapeHtml(toThumbSrc(src))}')" aria-label="${safeName} 이미지 ${i + 1} 보기"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}
    </div>` : '';
  return `
    <div class="img-gallery mb-5">
      <div class="img-slider">
        <div class="img-slider-viewport" role="button" tabindex="0" aria-label="${safeName} 이미지 크게 보기">
          <div class="img-slider-track">${slidesHtml}</div>
        </div>
        ${btnsHtml}
        ${multi ? `<p class="img-slider-count" aria-live="polite"><span class="img-slider-current">1</span> / ${images.length}</p>` : ''}
      </div>
      ${thumbsHtml}
    </div>`;
}

function initGallery(container) {
  const gallery = container.querySelector('.img-gallery');
  if (!gallery) return;

  const track = gallery.querySelector('.img-slider-track');
  const slides = gallery.querySelectorAll('.img-slider-slide');
  const thumbs = gallery.querySelectorAll('.img-thumb');
  const counter = gallery.querySelector('.img-slider-current');
  const prevBtn = gallery.querySelector('.img-slider-btn.prev');
  const nextBtn = gallery.querySelector('.img-slider-btn.next');
  const imageSrcs = [...slides].map(s => s.querySelector('img')?.src).filter(Boolean);
  let current = 0;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === current);
      if (i === current) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = String(current + 1);
  }

  prevBtn?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  nextBtn?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));

  const viewport = gallery.querySelector('.img-slider-viewport');
  if (viewport) {
    const open = () => { if (imageSrcs.length) openLightbox(imageSrcs, current, goTo); };
    viewport.addEventListener('click', open);
    viewport.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }
}

function openLightbox(srcs, startIdx = 0, onNavigate = null) {
  let current = startIdx;
  const returnFocus = document.activeElement;
  const multi = srcs.length > 1;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '이미지 크게 보기');

  overlay.innerHTML = `
    <img id="lb-img" class="lightbox-img" src="${escapeHtml(srcs[current])}" alt="">
    <button type="button" id="lb-close" class="lightbox-btn lightbox-close" aria-label="이미지 닫기">✕</button>
    ${multi ? `<button type="button" id="lb-prev" class="lightbox-btn lightbox-prev" aria-label="이전 이미지">&#8249;</button>
               <button type="button" id="lb-next" class="lightbox-btn lightbox-next" aria-label="다음 이미지">&#8250;</button>` : ''}
  `;

  const img = overlay.querySelector('#lb-img');
  const goTo = idx => {
    current = (idx + srcs.length) % srcs.length;
    img.src = srcs[current];
    onNavigate?.(current);
  };

  const close = () => {
    overlay.remove();
    lightboxOpen = false;
    document.removeEventListener('keydown', onKey);
    returnFocus?.focus?.();
  };
  const onKey = e => {
    if (e.key === 'Escape') close();
    if (multi && e.key === 'ArrowLeft') goTo(current - 1);
    if (multi && e.key === 'ArrowRight') goTo(current + 1);
    trapFocus(e, overlay);
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('#lb-close').addEventListener('click', close);
  overlay.querySelector('#lb-prev')?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  overlay.querySelector('#lb-next')?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  lightboxOpen = true;
  overlay.querySelector('#lb-close').focus();
}


function closeProjectModal() {
  document.getElementById('project-modal').innerHTML = '';
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onModalKeydown);
  setPageInert(false);
  // 모달을 연 카드(버튼)로 포커스를 돌려준다
  if (modalReturnFocus && document.contains(modalReturnFocus)) modalReturnFocus.focus();
  modalReturnFocus = null;
}

function onModalKeydown(e) {
  // 라이트박스가 위에 떠 있으면 키 입력은 라이트박스가 처리한다
  if (lightboxOpen) return;
  if (e.key === 'Escape') {
    closeProjectModal();
    return;
  }
  const box = document.querySelector('#project-modal .project-modal-box');
  if (box) trapFocus(e, box);
}

function renderEducation(education) {
  const eduHtml = education.map(edu => `
    <li class="edu-row">
      <p class="edu-period tabular-nums">${escapeHtml(edu.period)}</p>
      <div>
        <h3 class="text-lg font-bold text-gray-900">${escapeHtml(edu.school)}</h3>
        ${edu.major ? `<p class="text-[15px] text-gray-700">${escapeHtml(edu.major)}</p>` : ''}
        ${edu.description ? `<p class="text-[15px] text-gray-600">${escapeHtml(edu.description)}</p>` : ''}
      </div>
    </li>
  `).join('');

  document.getElementById('education-content').innerHTML = `<ul class="edu-list max-w-3xl">${eduHtml}</ul>`;
}

// 연락 수단은 이메일 하나만 큰 텍스트 링크로 둔다
function renderContact(contact) {
  document.getElementById('contact-content').innerHTML = contact.email
    ? `<p class="contact-line"><span class="contact-label">이메일</span> <a class="contact-mail" href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>`
    : '';
}

function renderFooter(name) {
  const year = new Date().getFullYear();
  document.getElementById('footer-text').textContent = `© ${year} ${name}`;
}

function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const setMenuOpen = open => {
    mobileMenu.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    menuIcon.setAttribute('d', open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16');
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(mobileMenu.classList.contains('hidden'));
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // 모바일 메뉴가 열려 있을 때 Esc 로 닫고 버튼으로 포커스 복귀
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        [...navLinks, ...mobileNavLinks].forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-20% 0px -80% 0px' });

  sections.forEach(section => observer.observe(section));
}

function initScrollTop() {
  const btn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}
