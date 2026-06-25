document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();

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
  renderEducation(data.education);
  renderContact(data.contact);
  renderFooter(data.hero.name);
}

function renderMeta(meta, hero) {
  document.title = meta.title;
  document.querySelector('meta[name="description"]').content = meta.description;
  document.querySelector('meta[property="og:title"]').content = meta.title;
  document.querySelector('meta[property="og:description"]').content = meta.description;
  document.getElementById('nav-logo').textContent = hero.nameEn;
}

function renderHero(hero) {
  document.getElementById('hero-content').innerHTML = `
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">${hero.name}</h1>
    <p class="text-xl sm:text-2xl text-blue-600 font-medium mb-6">${hero.title}</p>
    <p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">${hero.subtitle}</p>
    <div class="flex justify-center gap-4">
      <a href="#contact" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">연락하기</a>
      <a href="${hero.resumeUrl}" class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">이력서 다운로드</a>
    </div>
  `;
}

function renderAbout(about) {
  const highlightsHtml = about.highlights
    .map(h => `<li class="flex items-center gap-2"><span class="w-2 h-2 bg-blue-600 rounded-full"></span>${h}</li>`)
    .join('');

  document.getElementById('about-content').innerHTML = `
    <p class="text-slate-600 text-lg max-w-3xl mx-auto text-center mb-8">${about.description}</p>
    <ul class="max-w-xl mx-auto space-y-3 text-slate-700">${highlightsHtml}</ul>
  `;
}

function renderSkills(skills) {
  const categoriesHtml = skills.map(cat => {
    const itemsHtml = cat.items.map(item => `
      <div class="mb-3">
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium text-slate-700">${item.name}</span>
          <span class="text-sm text-slate-500">${item.level}%</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full" style="width: ${item.level}%"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">${cat.category}</h3>
        ${itemsHtml}
      </div>
    `;
  }).join('');

  document.getElementById('skills-content').innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${categoriesHtml}</div>
  `;
}

function renderExperience(experience) {
  const itemsHtml = experience.map(exp => {
    const highlightsHtml = exp.highlights
      .map(h => `<li class="text-slate-600">${h}</li>`)
      .join('');

    return `
      <div class="relative pl-8 pb-8 border-l-2 border-blue-200 last:pb-0">
        <div class="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
        <div class="bg-slate-50 rounded-xl p-6">
          <span class="text-sm text-blue-600 font-medium">${exp.period}</span>
          <h3 class="text-xl font-semibold text-slate-900 mt-1">${exp.company}</h3>
          <p class="text-slate-500 mb-3">${exp.role}</p>
          <p class="text-slate-600 mb-3">${exp.description}</p>
          <ul class="list-disc list-inside space-y-1">${highlightsHtml}</ul>
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
      .map(t => `<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">${t}</span>`)
      .join('');

    const linksHtml = [
      proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="text-slate-500 hover:text-blue-600 transition-colors text-sm">GitHub</a>` : '',
      proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank" class="text-slate-500 hover:text-blue-600 transition-colors text-sm">Demo</a>` : ''
    ].filter(Boolean).join('<span class="text-slate-300">|</span>');

    return `
      <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">${proj.name}</h3>
        <p class="text-slate-600 text-sm mb-4">${proj.description}</p>
        <div class="flex flex-wrap gap-2 mb-4">${techsHtml}</div>
        <div class="flex items-center gap-3">${linksHtml}</div>
      </div>
    `;
  }).join('');

  document.getElementById('projects-content').innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cardsHtml}</div>
  `;
}

function renderEducation(education) {
  const itemsHtml = education.map(edu => `
    <div class="bg-slate-50 rounded-xl p-6">
      <span class="text-sm text-blue-600 font-medium">${edu.period}</span>
      <h3 class="text-xl font-semibold text-slate-900 mt-1">${edu.school}</h3>
      <p class="text-slate-500">${edu.major}</p>
      ${edu.description ? `<p class="text-slate-600 mt-2">${edu.description}</p>` : ''}
    </div>
  `).join('');

  document.getElementById('education-content').innerHTML = `
    <div class="max-w-3xl mx-auto space-y-4">${itemsHtml}</div>
  `;
}

function renderContact(contact) {
  const links = [
    contact.email ? { label: 'Email', href: `mailto:${contact.email}`, text: contact.email } : null,
    contact.github ? { label: 'GitHub', href: contact.github, text: contact.github.replace('https://', '') } : null,
    contact.linkedin ? { label: 'LinkedIn', href: contact.linkedin, text: contact.linkedin.replace('https://', '') } : null,
    contact.blog ? { label: 'Blog', href: contact.blog, text: contact.blog.replace('https://', '') } : null,
  ].filter(Boolean);

  const linksHtml = links.map(link => `
    <a href="${link.href}" target="_blank" class="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <span class="text-sm font-medium text-blue-600 w-20">${link.label}</span>
      <span class="text-slate-600 text-sm">${link.text}</span>
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
