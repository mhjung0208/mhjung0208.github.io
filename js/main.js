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
  renderEducation(data.education, data.certificates);
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
      <span class="text-sm text-gray-300">${b.name}</span>
      <span class="text-xs text-accent">${b.level}</span>
    </div>
  `).join('');

  const latestTechsHtml = latestProject.techs.slice(0, 3).map(t =>
    `<span class="px-2.5 py-1 rounded-full text-xs border border-accent/30 text-accent">${t}</span>`
  ).join('');

  const profileImageHtml = hero.profileImage
    ? `<img src="${hero.profileImage}" alt="${hero.name}" class="w-full h-full object-cover rounded-xl" loading="lazy">`
    : `<div class="w-full h-full rounded-xl bg-gradient-to-br from-dark-600 to-dark-800 flex items-center justify-center">
        <svg class="w-32 h-32 text-accent/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>`;

  document.getElementById('hero-content').innerHTML = `
    <!-- 코드 장식 -->
    <div class="code-decoration absolute top-24 left-8 hidden lg:block">&lt;div className="info"&gt;</div>
    <div class="code-decoration absolute top-24 right-8 hidden lg:block">function create() {</div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center py-8 lg:py-0">

      <!-- 좌측: Latest Project + Stats -->
      <div class="space-y-6 order-2 lg:order-1">
        <div class="glass-card rounded-2xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 bg-accent rounded-full"></span>
            <span class="text-xs text-accent font-medium">Latest Project</span>
          </div>
          <h3 class="text-white font-semibold mb-2">${latestProject.name}</h3>
          <p class="text-gray-500 text-sm mb-4 leading-relaxed">${latestProject.description}</p>
          <div class="flex flex-wrap gap-2">${latestTechsHtml}</div>
        </div>

        <div class="glass-card rounded-2xl p-6">
          <div class="flex items-center justify-around">${statsHtml}</div>
        </div>
      </div>

      <!-- 중앙: 프로필 이미지 -->
      <div class="flex justify-center order-1 lg:order-2">
        <div class="hero-profile-frame w-64 h-80 sm:w-72 sm:h-96">
          ${profileImageHtml}
        </div>
      </div>

      <!-- 우측: 타이틀 + 스킬 뱃지 + CTA -->
      <div class="space-y-6 order-3">
        <div>
          <p class="text-accent text-sm font-medium mb-3">${hero.title}</p>
          <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight mb-1">${hero.heading}</h1>
          <h1 class="text-3xl sm:text-4xl font-bold leading-tight"><span class="accent-underline text-white">${hero.headingAccent}</span></h1>
        </div>

        <div class="glass-card rounded-2xl p-5">
          <p class="text-xs text-gray-500 mb-3 uppercase tracking-wider">Core Skills</p>
          <div class="space-y-2.5">${badgesHtml}</div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <a href="#projects" class="px-6 py-3 bg-accent text-dark-900 rounded-lg font-medium text-sm hover:bg-accent-light transition-colors text-center flex items-center justify-center gap-2">
            View Projects
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
          <a href="#contact" class="px-6 py-3 border border-accent/30 text-accent rounded-lg font-medium text-sm hover:bg-accent/10 transition-colors text-center flex items-center justify-center gap-2">
            Hire Me
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
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
        <span class="text-gray-400">${h}</span>
      </li>
    `)
    .join('');

  const profileImageHtml = about.profileImage
    ? `<img src="${about.profileImage}" alt="프로필 사진" class="w-48 h-48 rounded-2xl object-cover" loading="lazy">`
    : `<div class="w-48 h-48 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
        <svg class="w-20 h-20 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>`;

  document.getElementById('about-content').innerHTML = `
    <div class="flex flex-col md:flex-row items-center gap-12">
      <div class="flex-shrink-0">${profileImageHtml}</div>
      <div class="flex-1">
        <p class="text-gray-400 text-lg leading-relaxed mb-8">${about.description}</p>
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
          <span class="text-sm text-gray-300">${item.name}</span>
          <span class="text-xs text-accent">${item.level}%</span>
        </div>
        <div class="skill-bar-track rounded-full h-1.5">
          <div class="skill-bar-fill h-1.5 rounded-full skill-bar" style="width: 0%" data-level="${item.level}"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1">
        <h3 class="text-white font-semibold mb-5 pb-3 border-b border-white/5">${cat.category}</h3>
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

function renderExperience(experience) {
  const itemsHtml = experience.map((exp, i) => {
    const highlightsHtml = exp.highlights
      .map(h => `<li class="text-gray-500 text-sm">${h}</li>`)
      .join('');

    return `
      <div class="relative pl-8 pb-10 last:pb-0">
        <div class="absolute left-0 top-0 bottom-0 w-px timeline-line"></div>
        <div class="absolute -left-[5px] top-1 w-[11px] h-[11px] rounded-full border-2 border-accent ${i === 0 ? 'bg-accent' : 'bg-dark-900'}"></div>
        <div class="glass-card rounded-2xl p-6 ml-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 class="text-lg font-semibold text-white">${exp.company}</h3>
            <span class="text-sm text-accent font-medium">${exp.period}</span>
          </div>
          <p class="text-gray-500 text-sm mb-3">${exp.role}</p>
          <p class="text-gray-400 text-sm mb-4">${exp.description}</p>
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
  const cardsHtml = projects.map(proj => {
    const techsHtml = proj.techs
      .map(t => `<span class="px-2 py-0.5 border border-accent/20 text-accent text-xs rounded-full">${t}</span>`)
      .join('');

    const imageHtml = proj.image
      ? `<div class="h-44 rounded-t-2xl overflow-hidden -mx-6 -mt-6 mb-5">
          <img src="${proj.image}" alt="${proj.name}" class="w-full h-full object-cover" loading="lazy">
        </div>`
      : `<div class="h-44 rounded-t-2xl overflow-hidden -mx-6 -mt-6 mb-5 bg-gradient-to-br from-dark-600 to-dark-800 flex items-center justify-center">
          <svg class="w-12 h-12 text-accent/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        </div>`;

    const linksHtml = [
      proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-gray-500 hover:text-accent transition-colors text-sm">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </a>` : '',
      proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-gray-500 hover:text-accent transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        Demo
      </a>` : ''
    ].filter(Boolean).join('');

    return `
      <div class="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1">
        ${imageHtml}
        <h3 class="text-lg font-semibold text-white mb-2">${proj.name}</h3>
        <p class="text-gray-500 text-sm mb-4 leading-relaxed">${proj.description}</p>
        <div class="flex flex-wrap gap-1.5 mb-5">${techsHtml}</div>
        <div class="flex items-center gap-4 pt-4 border-t border-white/5">${linksHtml}</div>
      </div>
    `;
  }).join('');

  document.getElementById('projects-content').innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cardsHtml}</div>
  `;
}

function renderEducation(education, certificates) {
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
        <h3 class="text-lg font-semibold text-white mt-0.5">${edu.school}</h3>
        <p class="text-gray-500 text-sm">${edu.major}</p>
        ${edu.description ? `<p class="text-gray-400 text-sm mt-1">${edu.description}</p>` : ''}
      </div>
    </div>
  `).join('');

  let certHtml = '';
  if (certificates && certificates.length > 0) {
    const certItemsHtml = certificates.map(cert => `
      <div class="glass-card rounded-2xl p-6 flex gap-4">
        <div class="flex-shrink-0 w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">${cert.name}</h3>
          <p class="text-gray-500 text-sm">${cert.issuer}</p>
          <span class="text-sm text-gray-600">${cert.date}</span>
        </div>
      </div>
    `).join('');

    certHtml = `
      <h3 class="text-xl font-semibold text-white mt-10 mb-6">Certificates</h3>
      <div class="space-y-4">${certItemsHtml}</div>
    `;
  }

  document.getElementById('education-content').innerHTML = `
    <div class="max-w-3xl mx-auto">
      <div class="space-y-4">${eduHtml}</div>
      ${certHtml}
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
    contact.phone ? { key: 'phone', label: 'Phone', href: `tel:${contact.phone}`, text: contact.phone } : null,
  ].filter(Boolean);

  const linksHtml = links.map(link => `
    <a href="${link.href}" target="_blank" class="glass-card flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5">
      <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
        ${CONTACT_ICONS[link.key] || ''}
      </div>
      <div>
        <p class="text-sm font-medium text-white">${link.label}</p>
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
