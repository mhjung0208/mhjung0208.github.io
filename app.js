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

  const rows = [
    ["Name", data.name],
    ["Birth", data.birth],
    ["Address", data.address],
    ["Email", data.email],
    ["Education", data.education]
  ];

  info.innerHTML = "";
  rows.forEach(([label, value]) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${label}:</strong> ${value || ""}`;
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
    const title = document.createElement("h3");
    const period = document.createElement("p");
    const desc = document.createElement("p");

    title.textContent = `${item.company || ""} | ${item.role || ""}`;
    period.textContent = item.period || "";
    desc.textContent = item.description || "";

    li.appendChild(title);
    li.appendChild(period);
    li.appendChild(desc);
    target.appendChild(li);
  });
}

function displayProjectName(folder) {
  return (folder || "").replace(/^\d+\.\s*/, "").trim();
}

function renderProjects(items) {
  const target = document.getElementById("projects");
  if (!target) return;

  target.innerHTML = "";
  (items || [])
    .sort((a, b) => (a.folder || "").localeCompare(b.folder || "", "en", { numeric: true }))
    .forEach((item) => {
      const li = document.createElement("li");
      const name = document.createElement("p");
      const summary = document.createElement("p");

      name.className = "project-name";
      name.textContent = displayProjectName(item.folder);

      summary.className = "project-summary";
      summary.textContent = item.summary || "";

      li.appendChild(name);
      li.appendChild(summary);
      target.appendChild(li);
    });
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
