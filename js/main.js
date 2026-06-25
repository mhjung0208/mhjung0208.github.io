document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initDarkMode();
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
  renderHero(data.hero);
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
  document.getElementById('nav-logo').textContent = hero.nameEn;
}

function renderHero(hero) {
  document.getElementById('hero-content').innerHTML = `
    <div class="mb-6">
      <span class="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">${hero.title}</span>
    </div>
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">${hero.name}</h1>
    <p class="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">${hero.subtitle}</p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <a href="#contact" class="px-8 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/25">연락하기</a>
      ${hero.resumeUrl && hero.resumeUrl !== '#' ? `<a href="${hero.resumeUrl}" target="_blank" class="px-8 py-3.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium">이력서 다운로드</a>` : ''}
    </div>
    <div class="mt-12 flex justify-center gap-6 text-slate-400">
      <a href="#about" class="hover:text-blue-600 transition-colors">
        <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </a>
    </div>
  `;
}

function renderAbout(about) {
  const highlightsHtml = about.highlights
    .map(h => `
      <li class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${h}</span>
      </li>
    `)
    .join('');

  const profileImageHtml = about.profileImage
    ? `<img src="${about.profileImage}" alt="프로필 사진" class="w-48 h-48 rounded-full object-cover shadow-lg" loading="lazy">`
    : `<div class="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
        <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>`;

  document.getElementById('about-content').innerHTML = `
    <div class="flex flex-col md:flex-row items-center gap-12">
      <div class="flex-shrink-0">
        ${profileImageHtml}
      </div>
      <div class="flex-1">
        <p class="text-slate-600 text-lg leading-relaxed mb-8">${about.description}</p>
        <ul class="space-y-3 text-slate-700">${highlightsHtml}</ul>
      </div>
    </div>
  `;
}

function renderSkills(skills) {
  const categoriesHtml = skills.map(cat => {
    const itemsHtml = cat.items.map(item => `
      <div class="mb-4 last:mb-0">
        <div class="flex justify-between mb-1.5">
          <span class="text-sm font-medium text-slate-700">${item.name}</span>
          <span class="text-xs text-slate-400">${item.level}%</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full skill-bar" style="width: 0%" data-level="${item.level}"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">${cat.category}</h3>
        ${itemsHtml}
      </div>
    `;
  }).join('');

  document.getElementById('skills-content').innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${categoriesHtml}</div>
  `;

  requestAnimationFrame(() => {
    document.querySelectorAll('.skill-bar').forEach(bar => {
      bar.style.transition = 'width 1s ease-out';
      bar.style.width = bar.dataset.level + '%';
    });
  });
}

function renderExperience(experience) {
  const itemsHtml = experience.map((exp, i) => {
    const highlightsHtml = exp.highlights
      .map(h => `<li class="text-slate-600 text-sm">${h}</li>`)
      .join('');

    return `
      <div class="relative pl-8 pb-10 last:pb-0 border-l-2 border-blue-100">
        <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-blue-600 ${i === 0 ? 'bg-blue-600' : 'bg-white'}"></div>
        <div class="bg-slate-50 rounded-2xl p-6 ml-4 hover:shadow-sm transition-shadow">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 class="text-lg font-semibold text-slate-900">${exp.company}</h3>
            <span class="text-sm text-blue-600 font-medium">${exp.period}</span>
          </div>
          <p class="text-slate-500 text-sm mb-3">${exp.role}</p>
          <p class="text-slate-600 text-sm mb-4">${exp.description}</p>
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
      .map(t => `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">${t}</span>`)
      .join('');

    const imageHtml = proj.image
      ? `<div class="h-40 rounded-t-2xl overflow-hidden -mx-6 -mt-6 mb-5">
          <img src="${proj.image}" alt="${proj.name}" class="w-full h-full object-cover" loading="lazy">
        </div>`
      : `<div class="h-40 rounded-t-2xl overflow-hidden -mx-6 -mt-6 mb-5 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        </div>`;

    const linksHtml = [
      proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-sm">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </a>` : '',
      proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        Demo
      </a>` : ''
    ].filter(Boolean).join('');

    return `
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
        ${imageHtml}
        <h3 class="text-lg font-semibold text-slate-900 mb-2">${proj.name}</h3>
        <p class="text-slate-500 text-sm mb-4 leading-relaxed">${proj.description}</p>
        <div class="flex flex-wrap gap-1.5 mb-5">${techsHtml}</div>
        <div class="flex items-center gap-4 pt-4 border-t border-slate-100">${linksHtml}</div>
      </div>
    `;
  }).join('');

  document.getElementById('projects-content').innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cardsHtml}</div>
  `;
}

function renderEducation(education, certificates) {
  const eduHtml = education.map(edu => `
    <div class="flex gap-4 bg-slate-50 rounded-2xl p-6">
      <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
        </svg>
      </div>
      <div>
        <span class="text-sm text-blue-600 font-medium">${edu.period}</span>
        <h3 class="text-lg font-semibold text-slate-900 mt-0.5">${edu.school}</h3>
        <p class="text-slate-500 text-sm">${edu.major}</p>
        ${edu.description ? `<p class="text-slate-600 text-sm mt-1">${edu.description}</p>` : ''}
      </div>
    </div>
  `).join('');

  let certHtml = '';
  if (certificates && certificates.length > 0) {
    const certItemsHtml = certificates.map(cert => `
      <div class="flex gap-4 bg-slate-50 rounded-2xl p-6">
        <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-slate-900">${cert.name}</h3>
          <p class="text-slate-500 text-sm">${cert.issuer}</p>
          <span class="text-sm text-slate-400">${cert.date}</span>
        </div>
      </div>
    `).join('');

    certHtml = `
      <h3 class="text-xl font-semibold text-slate-900 mt-10 mb-6">자격증</h3>
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
  github: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
  linkedin: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  blog: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 110-2 1 1 0 010 2z"/></svg>'
};

function renderContact(contact) {
  const links = [
    contact.email ? { key: 'email', label: 'Email', href: `mailto:${contact.email}`, text: contact.email } : null,
    contact.github ? { key: 'github', label: 'GitHub', href: contact.github, text: contact.github.replace('https://', '') } : null,
    contact.linkedin ? { key: 'linkedin', label: 'LinkedIn', href: contact.linkedin, text: contact.linkedin.replace('https://', '') } : null,
    contact.blog ? { key: 'blog', label: 'Blog', href: contact.blog, text: contact.blog.replace('https://', '') } : null,
  ].filter(Boolean);

  const linksHtml = links.map(link => `
    <a href="${link.href}" target="_blank" class="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-slate-100">
      <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
        ${CONTACT_ICONS[link.key] || ''}
      </div>
      <div>
        <p class="text-sm font-medium text-slate-900">${link.label}</p>
        <p class="text-sm text-slate-500">${link.text}</p>
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

function initDarkMode() {
  const toggle = document.getElementById('dark-toggle');
  const icon = document.getElementById('dark-icon');
  const sunPath = 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';
  const moonPath = 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';

  if (localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    icon.querySelector('path').setAttribute('d', sunPath);
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    icon.querySelector('path').setAttribute('d', isDark ? sunPath : moonPath);
  });
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
