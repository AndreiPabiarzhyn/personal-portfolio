import * as THREE from "three";

const state = { projects: [], filter: "all" };
const grid = document.querySelector("#project-grid");
const template = document.querySelector("#project-template");
const filters = document.querySelector("#filters");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const languageSwitcher = document.querySelector(".language-switcher");
const previewObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const preview = entry.target;
    const iframe = document.createElement("iframe");
    iframe.src = preview.dataset.src;
    iframe.title = `${preview.dataset.name} live preview`;
    iframe.loading = "lazy";
    iframe.tabIndex = -1;
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    preview.append(iframe);
    observer.unobserve(preview);
  });
}, { rootMargin: "180px 0px" });

const translations = {
  en: {
    "nav.projects": "Projects", "nav.about": "About", "nav.contact": "Contact",
    "hero.copy": "I build web products, games and interfaces made to be explored.",
    "hero.button": "Explore<br>projects",
    "about.eyebrow": "02 — ABOUT ME", "about.title": "Code is a<br><em>material.</em>",
    "about.copy1": "I turn ideas into working digital products — from Python logic to expressive interfaces and game mechanics.",
    "about.copy2": "I love projects where engineering meets a strong visual character.",
    "about.link": "Explore my GitHub", "projects.title": "Projects",
    "projects.count": "selected works<br>from GitHub", "projects.all": "All",
    "contact.title": "Got an idea?<br><span>Let's bring it to life.</span>",
    "contact.copy": "Open to meaningful projects, collaboration and new experiments.",
    "contact.button": "Contact via GitHub"
  },
  ru: {
    "nav.projects": "Проекты", "nav.about": "Обо мне", "nav.contact": "Контакты",
    "hero.copy": "Создаю веб-продукты, игры и интерфейсы, которые хочется исследовать.",
    "hero.button": "Смотреть<br>проекты",
    "about.eyebrow": "02 — ОБО МНЕ", "about.title": "Код — это<br><em>материал.</em>",
    "about.copy1": "Превращаю идеи в работающие цифровые продукты: от логики на Python до выразительных интерфейсов и игровых механик.",
    "about.copy2": "Люблю проекты, где инженерия встречается с визуальным характером.",
    "about.link": "Исследовать мой GitHub", "projects.title": "Проекты",
    "projects.count": "избранных работ<br>из GitHub", "projects.all": "Все",
    "contact.title": "Есть идея?<br><span>Давайте оживим.</span>",
    "contact.copy": "Открыт для интересных проектов, командной работы и новых экспериментов.",
    "contact.button": "Связаться через GitHub"
  },
  pl: {
    "nav.projects": "Projekty", "nav.about": "O mnie", "nav.contact": "Kontakt",
    "hero.copy": "Tworzę produkty internetowe, gry i interfejsy, które chce się odkrywać.",
    "hero.button": "Zobacz<br>projekty",
    "about.eyebrow": "02 — O MNIE", "about.title": "Kod jest<br><em>materiałem.</em>",
    "about.copy1": "Zmieniam pomysły w działające produkty cyfrowe — od logiki w Pythonie po wyraziste interfejsy i mechaniki gier.",
    "about.copy2": "Lubię projekty, w których inżynieria spotyka się z mocnym charakterem wizualnym.",
    "about.link": "Zobacz mój GitHub", "projects.title": "Projekty",
    "projects.count": "wybranych prac<br>z GitHuba", "projects.all": "Wszystkie",
    "contact.title": "Masz pomysł?<br><span>Ożywmy go razem.</span>",
    "contact.copy": "Jestem otwarty na ciekawe projekty, współpracę i nowe eksperymenty.",
    "contact.button": "Kontakt przez GitHub"
  }
};

document.querySelector("#year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeReveals(root = document) {
  root.querySelectorAll(".reveal:not(.visible)").forEach((element) => revealObserver.observe(element));
}

observeReveals();

window.addEventListener("scroll", () => {
  document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

async function loadProjects() {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Projects unavailable");
    state.projects = await response.json();
    renderFilters();
    renderProjects();
  } catch {
    grid.innerHTML = '<p class="project-error">Не удалось загрузить проекты. Загляни прямо в <a href="https://github.com/AndreiPabiarzhyn">GitHub ↗</a></p>';
  }
}

function renderFilters() {
  const languages = [...new Set(state.projects.map((project) => project.language).filter(Boolean))].slice(0, 6);
  filters.innerHTML = [
    `<button class="active" type="button" data-filter="all">${translations[document.documentElement.lang]["projects.all"]}</button>`,
    ...languages.map((language) => `<button type="button" data-filter="${escapeHtml(language)}">${escapeHtml(language)}</button>`)
  ].join("");
}

function setLanguage(language) {
  if (!translations[language]) return;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translations[language][element.dataset.i18n];
    if (value) element.innerHTML = value;
  });
  languageSwitcher.querySelector(".active")?.classList.remove("active");
  languageSwitcher.querySelector(`[data-lang="${language}"]`)?.classList.add("active");
  if (state.projects.length) renderFilters();
  localStorage.setItem("portfolio-language", language);
}

languageSwitcher.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lang]");
  if (button) setLanguage(button.dataset.lang);
});

function renderProjects() {
  grid.innerHTML = "";
  const projects = state.filter === "all"
    ? state.projects
    : state.projects.filter((project) => project.language === state.filter);

  document.querySelector("#project-count").textContent = state.projects.length.toString().padStart(2, "0");

  projects.forEach((project, index) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".project-card");
    card.dataset.language = project.language;
    card.querySelector(".card-index").textContent = `PROJECT / ${String(index + 1).padStart(2, "0")}`;
    card.querySelector(".card-language").textContent = project.language;
    card.querySelector(".visual-letter").textContent = project.name[0];
    card.querySelector("h3").textContent = project.name.replaceAll("-", " ");
    card.querySelector(".card-body p").textContent = project.description;
    card.querySelector(".card-stats").textContent = `★ ${project.stargazers_count}  ·  ⑂ ${project.forks_count}`;

    const topicContainer = card.querySelector(".card-topics");
    const topics = project.topics.length ? project.topics.slice(0, 4) : [project.language];
    topics.forEach((topic) => {
      const chip = document.createElement("span");
      chip.textContent = topic;
      topicContainer.append(chip);
    });

    const githubLink = card.querySelector(".github-link");
    githubLink.href = project.html_url;
    const demoLink = card.querySelector(".demo-link");
    if (project.homepage) {
      demoLink.href = project.homepage;
      const preview = card.querySelector(".live-preview");
      preview.dataset.src = project.homepage;
      preview.dataset.name = project.name;
      previewObserver.observe(preview);
    } else {
      demoLink.remove();
      card.querySelector(".live-preview").remove();
      card.querySelector(".preview-badge").remove();
    }

    if (!reducedMotion) setupCardTilt(card);
    grid.append(fragment);
  });
  observeReveals(grid);
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  filters.querySelector(".active")?.classList.remove("active");
  button.classList.add("active");
  state.filter = button.dataset.filter;
  renderProjects();
});

function setupCardTilt(card) {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initSpace() {
  const canvas = document.querySelector("#space");
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080b0a, 0.035);

  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight);

  const particleCount = innerWidth < 700 ? 650 : 1400;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const acid = new THREE.Color(0xc7ff38);
  const violet = new THREE.Color(0x9c7bff);

  for (let index = 0; index < particleCount; index++) {
    const stride = index * 3;
    positions[stride] = (Math.random() - 0.5) * 24;
    positions[stride + 1] = (Math.random() - 0.5) * 18;
    positions[stride + 2] = (Math.random() - 0.5) * 18;
    const color = Math.random() > 0.78 ? violet : acid;
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.35, 0.32, 110, 16),
    new THREE.MeshBasicMaterial({ color: 0x9c7bff, wireframe: true, transparent: true, opacity: 0.08 })
  );
  knot.position.set(3.7, 0.2, -2);
  scene.add(knot);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  });

  const clock = new THREE.Clock();
  function animate() {
    const time = clock.getElapsedTime();
    particles.rotation.y = time * 0.018 + window.scrollY * 0.00008;
    particles.rotation.x += (pointer.y * 0.035 - particles.rotation.x) * 0.015;
    camera.position.x += (pointer.x * 0.28 - camera.position.x) * 0.025;
    knot.rotation.x = time * 0.08;
    knot.rotation.y = time * 0.13;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

setLanguage(localStorage.getItem("portfolio-language") || "en");
if (!reducedMotion) initSpace();
loadProjects();
