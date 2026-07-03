import * as THREE from "three";

const state = { projects: [], filter: "all" };
const grid = document.querySelector("#project-grid");
const template = document.querySelector("#project-template");
const filters = document.querySelector("#filters");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    '<button class="active" type="button" data-filter="all">Все</button>',
    ...languages.map((language) => `<button type="button" data-filter="${escapeHtml(language)}">${escapeHtml(language)}</button>`)
  ].join("");
}

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
      demoLink.textContent = "Demo ↗";
    } else {
      demoLink.remove();
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

if (!reducedMotion) initSpace();
loadProjects();
