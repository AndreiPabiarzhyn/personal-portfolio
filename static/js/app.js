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
    "nav.projects": "Projects", "nav.skills": "Skills", "nav.about": "About", "nav.contact": "Contact",
    "hero.copy": "I build web products, games and interfaces made to be explored.",
    "hero.button": "Explore<br>projects",
    "about.eyebrow": "02 — ABOUT ME", "about.title": "Code is a<br><em>material.</em>",
    "about.copy1": "I turn ideas into working digital products — from Python logic to expressive interfaces and game mechanics.",
    "about.copy2": "I love projects where engineering meets a strong visual character.",
    "about.link": "Explore my GitHub", "projects.title": "Projects",
    "skills.eyebrow": "03 — CAPABILITIES", "skills.title": "My creative<br><em>toolbox.</em>",
    "skills.intro": "A practical stack for taking an idea from first prototype to a polished, deployed product.",
    "skills.backend": "BACKEND / LOGIC", "skills.backendCopy": "APIs, server-side rendering, automation and application architecture.",
    "skills.frontend": "FRONTEND / UI", "skills.frontendCopy": "Responsive interfaces, state, browser APIs and thoughtful interactions.",
    "skills.creative": "CREATIVE / 3D", "skills.creativeCopy": "Real-time scenes, motion systems, particles and immersive web experiences.",
    "skills.product": "PRODUCT / SHIP", "skills.productCopy": "Version control, deployment, performance and iterative product delivery.",
    "projects.count": "selected works<br>from GitHub", "projects.all": "All",
    "contact.title": "Got an idea?<br><span>Let's bring it to life.</span>",
    "contact.copy": "Open to meaningful projects, collaboration and new experiments.",
    "contact.button": "Contact via GitHub"
  },
  ru: {
    "nav.projects": "Проекты", "nav.skills": "Навыки", "nav.about": "Обо мне", "nav.contact": "Контакты",
    "hero.copy": "Создаю веб-продукты, игры и интерфейсы, которые хочется исследовать.",
    "hero.button": "Смотреть<br>проекты",
    "about.eyebrow": "02 — ОБО МНЕ", "about.title": "Код — это<br><em>материал.</em>",
    "about.copy1": "Превращаю идеи в работающие цифровые продукты: от логики на Python до выразительных интерфейсов и игровых механик.",
    "about.copy2": "Люблю проекты, где инженерия встречается с визуальным характером.",
    "about.link": "Исследовать мой GitHub", "projects.title": "Проекты",
    "skills.eyebrow": "03 — ВОЗМОЖНОСТИ", "skills.title": "Мой творческий<br><em>инструментарий.</em>",
    "skills.intro": "Практический стек, чтобы провести идею от первого прототипа до отполированного продукта в интернете.",
    "skills.backend": "BACKEND / ЛОГИКА", "skills.backendCopy": "API, серверный рендеринг, автоматизация и архитектура приложений.",
    "skills.frontend": "FRONTEND / UI", "skills.frontendCopy": "Адаптивные интерфейсы, состояние, браузерные API и продуманные взаимодействия.",
    "skills.creative": "КРЕАТИВ / 3D", "skills.creativeCopy": "Сцены реального времени, системы движения, частицы и иммерсивный веб.",
    "skills.product": "ПРОДУКТ / РЕЛИЗ", "skills.productCopy": "Контроль версий, деплой, производительность и итеративная разработка.",
    "projects.count": "избранных работ<br>из GitHub", "projects.all": "Все",
    "contact.title": "Есть идея?<br><span>Давайте оживим.</span>",
    "contact.copy": "Открыт для интересных проектов, командной работы и новых экспериментов.",
    "contact.button": "Связаться через GitHub"
  },
  pl: {
    "nav.projects": "Projekty", "nav.skills": "Umiejętności", "nav.about": "O mnie", "nav.contact": "Kontakt",
    "hero.copy": "Tworzę produkty internetowe, gry i interfejsy, które chce się odkrywać.",
    "hero.button": "Zobacz<br>projekty",
    "about.eyebrow": "02 — O MNIE", "about.title": "Kod jest<br><em>materiałem.</em>",
    "about.copy1": "Zmieniam pomysły w działające produkty cyfrowe — od logiki w Pythonie po wyraziste interfejsy i mechaniki gier.",
    "about.copy2": "Lubię projekty, w których inżynieria spotyka się z mocnym charakterem wizualnym.",
    "about.link": "Zobacz mój GitHub", "projects.title": "Projekty",
    "skills.eyebrow": "03 — MOŻLIWOŚCI", "skills.title": "Mój kreatywny<br><em>warsztat.</em>",
    "skills.intro": "Praktyczny zestaw narzędzi, który prowadzi pomysł od prototypu do dopracowanego produktu online.",
    "skills.backend": "BACKEND / LOGIKA", "skills.backendCopy": "API, rendering po stronie serwera, automatyzacja i architektura aplikacji.",
    "skills.frontend": "FRONTEND / UI", "skills.frontendCopy": "Responsywne interfejsy, stan, API przeglądarki i przemyślane interakcje.",
    "skills.creative": "KREATYWNE / 3D", "skills.creativeCopy": "Sceny czasu rzeczywistego, systemy ruchu, cząsteczki i immersyjny web.",
    "skills.product": "PRODUKT / PUBLIKACJA", "skills.productCopy": "Kontrola wersji, wdrażanie, wydajność i iteracyjne dostarczanie produktu.",
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

  const dustGeometry = new THREE.BufferGeometry();
  const dustCount = innerWidth < 700 ? 130 : 300;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let index = 0; index < dustCount * 3; index += 3) {
    dustPositions[index] = (Math.random() - 0.5) * 18;
    dustPositions[index + 1] = (Math.random() - 0.5) * 13;
    dustPositions[index + 2] = (Math.random() - 0.5) * 8 + 2;
  }
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({ color: 0xeef4e8, size: 0.045, transparent: true, opacity: 0.24 })
  );
  scene.add(dust);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.35, 0.32, 110, 16),
    new THREE.MeshBasicMaterial({ color: 0x9c7bff, wireframe: true, transparent: true, opacity: 0.15 })
  );
  knot.position.set(3.7, 0.2, -2);
  scene.add(knot);

  const orbitalGroup = new THREE.Group();
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xc7ff38, wireframe: true, transparent: true, opacity: 0.28 });
  const nodeGeometry = new THREE.IcosahedronGeometry(0.28, 1);
  const nodes = [];
  [
    [-4.2, 2.3, -1.5, 0.9],
    [4.6, -2.2, -3, 1.25],
    [-3.4, -2.7, -2, 0.65],
    [1.5, 3.1, -4, 0.75],
  ].forEach(([x, y, z, scale]) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(x, y, z);
    node.scale.setScalar(scale);
    node.userData.baseY = y;
    node.userData.speed = 0.35 + Math.random() * 0.35;
    nodes.push(node);
    orbitalGroup.add(node);
  });

  [2.3, 3.4, 4.5].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.008, 4, 100),
      new THREE.MeshBasicMaterial({
        color: index % 2 ? 0x9c7bff : 0xc7ff38,
        transparent: true,
        opacity: 0.08,
      })
    );
    ring.rotation.set(Math.PI * (0.25 + index * 0.13), index * 0.55, index * 0.24);
    orbitalGroup.add(ring);
  });
  orbitalGroup.position.z = -3.5;
  scene.add(orbitalGroup);

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
    const scrollProgress = window.scrollY / Math.max(document.body.scrollHeight - innerHeight, 1);
    particles.rotation.y = time * 0.018 + scrollProgress * 0.8;
    particles.rotation.x += (pointer.y * 0.035 - particles.rotation.x) * 0.015;
    dust.rotation.y = -time * 0.025;
    dust.position.y = scrollProgress * 1.8;
    camera.position.x += (pointer.x * 0.28 - camera.position.x) * 0.025;
    camera.position.y += (-pointer.y * 0.18 - camera.position.y) * 0.025;
    knot.rotation.x = time * 0.08;
    knot.rotation.y = time * 0.13;
    knot.position.y = Math.sin(time * 0.45) * 0.24 - scrollProgress * 1.1;
    orbitalGroup.rotation.y = time * 0.035 + pointer.x * 0.08;
    orbitalGroup.rotation.x = scrollProgress * 0.65;
    nodes.forEach((node, index) => {
      node.rotation.x = time * node.userData.speed;
      node.rotation.y = time * node.userData.speed * 1.3;
      node.position.y = node.userData.baseY + Math.sin(time * node.userData.speed + index) * 0.22;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

setLanguage(localStorage.getItem("portfolio-language") || "en");
if (!reducedMotion) initSpace();
loadProjects();
