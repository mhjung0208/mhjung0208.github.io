document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initScrollTop();
  initFadeIn();

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
  renderMeta(data.meta, data.hero);
  renderHero(data.hero, data.projects);
  renderAbout(data.about);
  renderSkills(data.skills);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderContact(data.contact);
  renderFooter(data.hero.name);
}

function renderMeta(meta, hero) {
  document.title = meta.title;
  document.querySelector('meta[name="description"]').content = meta.description;
  document.querySelector('meta[property="og:title"]').content = meta.title;
  document.querySelector('meta[property="og:description"]').content = meta.description;
  if (meta.ogImage) {
    document.querySelector('meta[property="og:image"]').content = meta.ogImage;
  }
  document.querySelector('#nav-logo span').textContent = hero.nameEn;
}

function renderHero(hero, projects) {
  const latestProject = projects[0];

  const statsHtml = hero.stats.map((stat, i) => {
    const divider = i < hero.stats.length - 1 ? '<div class="stat-divider"></div>' : '';
    return `
      <div class="text-center">
        <p class="text-2xl font-bold text-accent">${stat.value}</p>
        <p class="text-xs text-gray-500 mt-1">${stat.label}</p>
      </div>
      ${divider}
    `;
  }).join('');

  const badgesHtml = hero.badges.map(b => `
    <div class="flex items-center justify-between gap-4">
      <span class="text-sm text-gray-600">${b.name}</span>
      <span class="text-xs text-accent">${b.level}</span>
    </div>
  `).join('');

  const latestTechsHtml = latestProject.techs.slice(0, 3).map(t =>
    `<span class="px-2.5 py-1 rounded-full text-xs border border-accent/30 text-accent">${t}</span>`
  ).join('');

  const profileImageHtml = hero.profileImage
    ? `<img src="${hero.profileImage}" alt="${hero.name}" class="w-full h-auto object-contain drop-shadow-2xl" loading="lazy">`
    : `<div class="w-full h-96 flex items-center justify-center">
        <svg class="w-32 h-32 text-accent/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>`;

  document.getElementById('hero-content').innerHTML = `
    <div class="code-decoration absolute top-24 left-8 hidden lg:block">&lt;div className="info"&gt;</div>
    <div class="code-decoration absolute bottom-24 right-8 hidden lg:block">function create() {</div>

    <div class="relative">
      <!-- 캐릭터 이미지 — 우측 하단 고정, 크게 -->
      <div class="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[55%] z-0 pointer-events-none">
        ${profileImageHtml}
      </div>

      <!-- 모바일: 이미지 상단 표시 -->
      <div class="lg:hidden flex justify-center mb-8">
        <div class="w-72">${profileImageHtml}</div>
      </div>

      <!-- 좌측: 타이틀 + CTA -->
      <div class="relative z-10 max-w-2xl space-y-8">
        <div>
          <p class="text-accent text-lg font-bold mb-3 tracking-widest uppercase">${hero.title}</p>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-2">${hero.heading}</h1>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"><span class="accent-underline text-gray-900">${hero.headingAccent}</span></h1>
          <p class="text-gray-500 mt-6 text-lg max-w-lg">${hero.subtitle}</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <a href="#projects" class="px-7 py-3.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-light transition-colors flex items-center gap-2">
            View Projects
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderAbout(about) {
  const highlightsHtml = about.highlights
    .map(h => `
      <li class="flex items-start gap-3">
        <svg class="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span class="text-gray-500">${h}</span>
      </li>
    `)
    .join('');

  const profileImageHtml = about.profileImage
    ? `<img src="${about.profileImage}" alt="프로필 사진" class="w-52 h-64 rounded-2xl object-cover shadow-md" loading="lazy">`
    : `<div class="w-52 h-64 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
        <svg class="w-20 h-20 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>`;

  document.getElementById('about-content').innerHTML = `
    <div class="flex flex-col md:flex-row items-center gap-12">
      <div class="flex-shrink-0">${profileImageHtml}</div>
      <div class="flex-1">
        <p class="text-gray-500 text-lg leading-relaxed mb-8">${about.description}</p>
        <ul class="space-y-3">${highlightsHtml}</ul>
      </div>
    </div>
  `;
}

function renderSkills(skills) {
  const categoriesHtml = skills.map(cat => {
    const itemsHtml = cat.items.map(item => `
      <div class="mb-4 last:mb-0">
        <div class="flex justify-between mb-2">
          <span class="text-sm text-gray-600">${item.name}</span>
          <span class="text-xs text-accent">${item.level}%</span>
        </div>
        <div class="skill-bar-track rounded-full h-1.5">
          <div class="skill-bar-fill h-1.5 rounded-full skill-bar" style="width: 0%" data-level="${item.level}"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1">
        <h3 class="text-gray-900 font-semibold mb-5 pb-3 border-b border-warm-200/50">${cat.category}</h3>
        ${itemsHtml}
      </div>
    `;
  }).join('');

  document.getElementById('skills-content').innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${categoriesHtml}</div>
  `;

  requestAnimationFrame(() => {
    document.querySelectorAll('.skill-bar').forEach(bar => {
      bar.style.width = bar.dataset.level + '%';
    });
  });
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

function renderExperience(experience) {
  const itemsHtml = experience.map((exp, i) => {
    const highlightsHtml = exp.highlights
      .map(h => `<li class="text-gray-500 text-sm">${h}</li>`)
      .join('');
    const duration = calcWorkDuration(exp.period);

    return `
      <div class="relative pl-8 pb-10 last:pb-0">
        <div class="absolute left-0 top-0 bottom-0 w-px timeline-line"></div>
        <div class="absolute -left-[5px] top-1 w-[11px] h-[11px] rounded-full border-2 border-accent ${i === 0 ? 'bg-accent' : 'bg-warm-50'}"></div>
        <div class="glass-card rounded-2xl p-6 ml-4">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-1">
            <h3 class="text-lg font-semibold text-gray-900">${exp.company}</h3>
            <div class="flex flex-col sm:items-end gap-0.5">
              <span class="text-sm font-bold text-accent">${exp.period}</span>
              ${duration ? `<span class="text-xs font-semibold text-accent/70">${duration}</span>` : ''}
            </div>
          </div>
          <p class="text-gray-500 text-sm mb-3">${exp.role}</p>
          <p class="text-gray-500 text-sm mb-4">${exp.description}</p>
          <ul class="list-disc list-inside space-y-1.5">${highlightsHtml}</ul>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('experience-content').innerHTML = `
    <div class="max-w-3xl mx-auto">${itemsHtml}</div>
  `;
}

function renderProjects(projects) {
  const cardsHtml = projects.map((proj, idx) => {
    const techsHtml = proj.techs
      .map(t => `<span class="px-2 py-0.5 border border-accent/20 text-accent text-xs rounded-full">${t}</span>`)
      .join('');

    const thumbSrc = proj.image || (proj.details?.images?.[0] || '');
    const imageHtml = thumbSrc
      ? `<div class="h-44 rounded-t-2xl overflow-hidden -mx-6 -mt-6 mb-5 bg-warm-100 flex items-center justify-center">
          <img src="${thumbSrc}" alt="${proj.name}" class="w-full h-full object-contain" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center\\'><svg class=\\'w-12 h-12 text-accent/15\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4\\'/></svg></div>'">
        </div>`
      : `<div class="h-44 rounded-t-2xl overflow-hidden -mx-6 -mt-6 mb-5 bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center">
          <svg class="w-12 h-12 text-accent/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        </div>`;

    const d = proj.details || {};
    const metaHtml = (d.company || d.period) ? `
      <div class="flex items-center gap-3 mb-3 text-xs text-gray-400">
        ${d.company ? `<span class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          ${d.company}
        </span>` : ''}
        ${d.company && d.period ? `<span class="text-warm-300">·</span>` : ''}
        ${d.period ? `<span class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          ${d.period}
        </span>` : ''}
      </div>` : '';

    return `
      <div class="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1 cursor-pointer group" data-project-idx="${idx}">
        ${imageHtml}
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-accent transition-colors">${proj.name}</h3>
          <svg class="w-4 h-4 text-gray-300 group-hover:text-accent flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </div>
        ${metaHtml}
        <p class="text-gray-500 text-sm mb-4 leading-relaxed">${proj.description}</p>
        <div class="flex flex-wrap gap-1.5">${techsHtml}</div>
      </div>
    `;
  }).join('');

  document.getElementById('projects-content').innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cardsHtml}</div>
  `;

  document.querySelectorAll('[data-project-idx]').forEach(card => {
    card.addEventListener('click', () => {
      openProjectModal(projects[parseInt(card.dataset.projectIdx)]);
    });
  });
}

function openProjectModal(proj) {
  const d = proj.details || {};

  function renderNestedList(items, level) {
    if (!items || !items.length) return '';
    const markers = ['•', '◦', '▪'];
    const marker = markers[Math.min(level, 2)];
    const indent = level * 16;
    return items.map(item => {
      const text = typeof item === 'string' ? item : item.text;
      const children = typeof item === 'object' ? (item.children || []) : [];
      return `
        <div style="padding-left:${indent}px" class="flex items-start gap-2 mb-1">
          <span class="notion-bullet text-gray-400 text-sm mt-0.5 flex-shrink-0 select-none">${marker}</span>
          <span class="text-gray-600 text-sm leading-relaxed">${text}</span>
        </div>
        ${children.length ? renderNestedList(children, level + 1) : ''}
      `;
    }).join('');
  }

  const techTagsHtml = proj.techs
    .map(t => `<span class="px-2.5 py-0.5 bg-warm-100 border border-warm-200 text-gray-600 text-xs rounded font-medium">${t}</span>`)
    .join('');

  const propertiesHtml = `
    <div class="notion-properties space-y-2.5 mb-6 text-sm">
      ${d.company ? `
        <div class="flex items-center gap-3">
          <span class="notion-prop-label text-gray-400 w-16 flex-shrink-0 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            회사
          </span>
          <span class="text-gray-700">${d.company}</span>
        </div>` : ''}
      <div class="flex items-start gap-3">
        <span class="notion-prop-label text-gray-400 w-16 flex-shrink-0 flex items-center gap-1.5 mt-0.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
          Skills
        </span>
        <div class="flex flex-wrap gap-1.5">${techTagsHtml}</div>
      </div>
      ${d.period ? `
        <div class="flex items-center gap-3">
          <span class="notion-prop-label text-gray-400 w-16 flex-shrink-0 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            기간
          </span>
          <span class="text-gray-700">${d.period}</span>
        </div>` : ''}
    </div>
  `;

  const linksSection = (proj.links || []).length ? `
    <div class="notion-section mb-7">
      <h3 class="notion-section-title text-gray-800 font-semibold text-base mb-3 flex items-center gap-2">
        🔗 관련 링크
      </h3>
      <div class="space-y-1.5 pl-1">
        ${proj.links.map(link => `
          <div class="flex items-start gap-2">
            <span class="text-gray-400 text-sm mt-0.5 select-none">•</span>
            <a href="${link.url}" target="_blank" class="text-blue-500 hover:text-blue-600 text-sm underline underline-offset-2 break-all">${link.title}</a>
          </div>
        `).join('')}
      </div>
    </div>` : '';

  const introItems = d.intro || [];
  const galleryImages = (d.images || []).length ? d.images : (proj.image ? [proj.image] : []);
  const galleryHtml = galleryImages.length ? buildGalleryHtml(galleryImages, proj.name) : '';

  const imageSection = galleryImages.length ? `
    <div class="mb-7">
      ${galleryHtml}
    </div>` : '';

  const introSection = introItems.length ? `
    <div class="notion-section mb-7">
      <h3 class="notion-section-title text-gray-800 font-semibold text-base mb-3 flex items-center gap-2">
        📸 프로젝트 소개
      </h3>
      <div class="pl-1 space-y-1">
        ${introItems.map(t => `
          <div class="flex items-start gap-2">
            <span class="text-gray-400 text-sm mt-0.5 select-none">•</span>
            <span class="text-gray-600 text-sm leading-relaxed">${t}</span>
          </div>
        `).join('')}
      </div>
    </div>` : '';

  const features = d.features || [];
  const featuresSection = features.length ? `
    <div class="notion-section mb-7">
      <h3 class="notion-section-title text-gray-800 font-semibold text-base mb-3 flex items-center gap-2">
        📌 담당 기능
      </h3>
      <div class="pl-1">${renderNestedList(features, 0)}</div>
    </div>` : '';

  document.getElementById('project-modal').innerHTML = `
    <div class="project-modal-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="modal-overlay">
      <div class="project-modal-box bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

        <div class="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex justify-end px-6 pt-5 pb-2">
          <button id="modal-close" class="w-8 h-8 rounded-md hover:bg-warm-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="px-10 pb-12 pt-2">
          <h1 class="text-3xl font-bold text-gray-900 mb-6 leading-tight">${proj.name}</h1>

          ${propertiesHtml}

          <hr class="border-warm-200 mb-7">

          ${imageSection}
          ${introSection}
          ${featuresSection}
          ${linksSection}
        </div>
      </div>
    </div>
  `;

  initGallery(document.getElementById('project-modal'));

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeProjectModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', onModalEsc);
  document.body.style.overflow = 'hidden';
}

function buildGalleryHtml(images, name) {
  const multi = images.length > 1;
  const slidesHtml = images.map((src, i) => `
    <div class="img-slider-slide" data-idx="${i}">
      <img src="${src}" alt="${name} ${i + 1}" loading="lazy" onerror="this.style.opacity=0">
    </div>`).join('');
  const btnsHtml = multi ? `
    <button class="img-slider-btn prev" aria-label="이전">
      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <button class="img-slider-btn next" aria-label="다음">
      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>` : '';
  const dotsHtml = multi
    ? `<div class="img-slider-dots">${images.map((_, i) => `<button class="img-slider-dot${i === 0 ? ' active' : ''}"></button>`).join('')}</div>`
    : '';
  const thumbsHtml = multi ? `
    <div class="img-thumbs">
      ${images.map((src, i) => `
        <button class="img-thumb${i === 0 ? ' active' : ''}" data-idx="${i}" style="background-image:url('${src}')" aria-label="${name} 이미지 ${i + 1}"></button>`).join('')}
    </div>` : '';
  return `
    <div class="img-gallery mb-5">
      <div class="img-slider">
        <div class="img-slider-viewport">
          ${btnsHtml}
          <div class="img-slider-track">${slidesHtml}</div>
        </div>
        ${dotsHtml}
      </div>
      ${thumbsHtml}
    </div>`;
}

function initGallery(container) {
  const gallery = container.querySelector('.img-gallery');
  if (!gallery) return;

  const track = gallery.querySelector('.img-slider-track');
  const slides = gallery.querySelectorAll('.img-slider-slide');
  const dots = gallery.querySelectorAll('.img-slider-dot');
  const thumbs = gallery.querySelectorAll('.img-thumb');
  const prevBtn = gallery.querySelector('.img-slider-btn.prev');
  const nextBtn = gallery.querySelector('.img-slider-btn.next');
  const imageSrcs = [...slides].map(s => s.querySelector('img')?.src).filter(Boolean);
  let current = 0;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  nextBtn?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));

  const viewport = gallery.querySelector('.img-slider-viewport');
  if (viewport) {
    viewport.style.cursor = 'zoom-in';
    viewport.addEventListener('click', e => {
      if (e.target.closest('.img-slider-btn')) return;
      if (imageSrcs.length) openLightbox(imageSrcs, current, goTo);
    });
  }
}

function openLightbox(srcs, startIdx = 0, onNavigate = null) {
  let current = startIdx;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;';

  const btnStyle = 'position:fixed;background:rgba(255,255,255,0.15);border:none;border-radius:50%;width:44px;height:44px;color:#fff;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s;';
  const multi = srcs.length > 1;

  overlay.innerHTML = `
    <img id="lb-img" src="${srcs[current]}" style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.5);pointer-events:none;">
    <button id="lb-close" style="${btnStyle}top:20px;right:24px;">✕</button>
    ${multi ? `<button id="lb-prev" style="${btnStyle}left:20px;top:50%;transform:translateY(-50%);">&#8249;</button>
               <button id="lb-next" style="${btnStyle}right:20px;top:50%;transform:translateY(-50%);">&#8250;</button>` : ''}
  `;

  const img = overlay.querySelector('#lb-img');
  const goTo = idx => {
    current = (idx + srcs.length) % srcs.length;
    img.src = srcs[current];
    onNavigate?.(current);
  };

  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => {
    if (e.key === 'Escape') close();
    if (multi && e.key === 'ArrowLeft') goTo(current - 1);
    if (multi && e.key === 'ArrowRight') goTo(current + 1);
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('#lb-close').addEventListener('click', close);
  overlay.querySelector('#lb-prev')?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  overlay.querySelector('#lb-next')?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
}


function closeProjectModal() {
  document.getElementById('project-modal').innerHTML = '';
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onModalEsc);
}

function onModalEsc(e) {
  if (e.key === 'Escape') closeProjectModal();
}

function renderEducation(education) {
  const eduHtml = education.map(edu => `
    <div class="glass-card rounded-2xl p-6 flex gap-4">
      <div class="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
        </svg>
      </div>
      <div>
        <span class="text-sm text-accent font-medium">${edu.period}</span>
        <h3 class="text-lg font-semibold text-gray-900 mt-0.5">${edu.school}</h3>
        ${edu.major ? `<p class="text-gray-500 text-sm">${edu.major}</p>` : ''}
        ${edu.description ? `<p class="text-gray-500 text-sm mt-1">${edu.description}</p>` : ''}
      </div>
    </div>
  `).join('');

  document.getElementById('education-content').innerHTML = `
    <div class="max-w-3xl mx-auto">
      <div class="space-y-4">${eduHtml}</div>
    </div>
  `;
}

const CONTACT_ICONS = {
  email: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
  phone: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>'
};

function renderContact(contact) {
  const links = [
    contact.email ? { key: 'email', label: 'Email', href: `mailto:${contact.email}`, text: contact.email } : null,
  ].filter(Boolean);

  const linksHtml = links.map(link => `
    <a href="${link.href}" target="_blank" class="glass-card flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5">
      <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
        ${CONTACT_ICONS[link.key] || ''}
      </div>
      <div>
        <p class="text-sm font-medium text-gray-900">${link.label}</p>
        <p class="text-sm text-gray-500">${link.text}</p>
      </div>
    </a>
  `).join('');

  document.getElementById('contact-content').innerHTML = `
    <div class="max-w-xl mx-auto space-y-3">${linksHtml}</div>
  `;
}

function renderFooter(name) {
  const year = new Date().getFullYear();
  document.getElementById('footer-text').innerHTML = `&copy; ${year} ${name}. All rights reserved.`;
}

function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuIcon.setAttribute('d', isOpen
      ? 'M4 6h16M4 12h16M4 18h16'
      : 'M6 18L18 6M6 6l12 12'
    );
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        [...navLinks, ...mobileNavLinks].forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
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
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
