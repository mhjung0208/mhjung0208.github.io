async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load: ${path}`);
  }
  return response.json();
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || "";
  }
}

function setCount(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = String(value ?? 0);
  }
}

function appendChipList(targetId, items) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = "";
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function renderAbout(data) {
  const info = document.getElementById("about-info");
  if (!info) return;

  const university = data.educationUniversity || data.university || "";
  const highSchool = data.educationHighSchool || data.highSchool || "";
  const legacyEducation = data.education || "";

  const rows = [
    ["Name", data.name],
    ["Birth", data.birth],
    ["Address", data.address],
    ["Email", data.email],
    ["University", university || legacyEducation],
    ["High School", highSchool]
  ];

  info.innerHTML = "";
  rows.forEach(([label, value]) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${label}</strong><span>${value || ""}</span>`;
    info.appendChild(li);
  });

  const photo = document.getElementById("about-photo");
  const photoBox = document.getElementById("photo-box");

  if (data.photo && photo && photoBox) {
    photo.src = data.photo;
    photo.style.display = "block";
    photoBox.style.display = "none";
  }
}

function renderCareer(items) {
  const target = document.getElementById("career-list");
  if (!target) return;

  target.innerHTML = "";
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    const header = document.createElement("div");
    const title = document.createElement("h3");
    const period = document.createElement("p");
    const descList = document.createElement("ul");

    header.className = "career-header";
    period.className = "career-period";
    title.textContent = item.role
      ? `${item.company || ""} | ${item.role}`
      : (item.company || "");
    period.textContent = item.period || "";
    descList.className = "career-desc";

    const descriptions = Array.isArray(item.descriptions)
      ? item.descriptions
      : (item.description ? [item.description] : []);

    descriptions.forEach((desc) => {
      const descItem = document.createElement("li");
      descItem.textContent = desc;
      descList.appendChild(descItem);
    });

    header.appendChild(title);
    header.appendChild(period);
    li.appendChild(header);
    li.appendChild(descList);
    target.appendChild(li);
  });
}

function displayProjectName(folder) {
  return (folder || "").replace(/^\d+\.\s*/, "").trim();
}

function renderProjects(items) {
  const target = document.getElementById("projects-list");
  if (!target) return;

  target.innerHTML = "";
  (items || [])
    .sort((a, b) => (a.folder || "").localeCompare(b.folder || "", "en", { numeric: true }))
    .forEach((item) => {
      const li = document.createElement("li");
      const content = document.createElement("div");
      const side = document.createElement("div");
      const kicker = document.createElement("span");
      const name = document.createElement("h3");
      const summary = document.createElement("p");
      const tags = document.createElement("ul");
      const pathWrap = document.createElement("div");
      const pathLabel = document.createElement("strong");
      const path = document.createElement("p");

      li.className = "project-card";
      content.className = "project-main";
      side.className = "project-side";
      kicker.className = "project-kicker";
      name.className = "project-name";
      summary.className = "project-summary";
      tags.className = "project-tags";
      path.className = "project-path";

      kicker.textContent = "Case Study";
      name.textContent = displayProjectName(item.folder);
      summary.textContent = item.summary || "";

      ["Portfolio", "Selected Work"].forEach((label) => {
        const tag = document.createElement("li");
        tag.textContent = label;
        tags.appendChild(tag);
      });

      pathLabel.textContent = "Source Folder";
      path.textContent = `Projects/${item.folder || ""}`;

      content.appendChild(kicker);
      content.appendChild(name);
      content.appendChild(summary);
      content.appendChild(tags);
      pathWrap.appendChild(pathLabel);
      pathWrap.appendChild(path);
      side.appendChild(pathWrap);
      li.appendChild(content);
      li.appendChild(side);
      target.appendChild(li);
    });
}

function setHeroFocus(text) {
  const heroFocus = document.getElementById("hero-focus");
  if (!heroFocus) return;

  const firstSentence = (text || "").split("\n")[0].trim();
  heroFocus.textContent = firstSentence || "Mobile development, shipping, and stable user experience.";
}

async function init() {
  try {
    const [title, about, introduce, career, stacks, tools, projects] = await Promise.all([
      loadJson("./content/title.json"),
      loadJson("./content/about.json"),
      loadJson("./content/introduce.json"),
      loadJson("./content/career.json"),
      loadJson("./content/stacks.json"),
      loadJson("./content/work-tools.json"),
      loadJson("./Projects/projects.json")
    ]);

    setText("title-main", title.headline);
    setText("title-sub", title.subheadline);
    setText("introduce-text", introduce.text);
    setHeroFocus(introduce.text);
    setCount("career-count", career.items?.length || 0);
    setCount("stack-count", stacks.items?.length || 0);
    setCount("project-count", projects.length || 0);

    renderAbout(about);
    renderCareer(career.items);
    appendChipList("stacks-list", stacks.items);
    appendChipList("tools-list", tools.items);
    renderProjects(projects);
  } catch (error) {
    console.error(error);
    const title = document.getElementById("title-main");
    if (title) {
      title.textContent = "콘텐츠를 불러오지 못했습니다.";
      title.classList.add("error");
    }
  }
}

init();
