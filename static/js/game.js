const COPY = {
  en: {
    introTitle: "Three challenges.<br>Three useful insights.",
    introText: "Test focus, pattern recognition and Python logic in a 90-second cognitive run.",
    start: "Start the run",
    level: "Level",
    next: "Next level",
    result: "See result",
    controls: "MOUSE / TOUCH · SPACE TO JUMP · ESC TO CLOSE",
    levelControls: ["MOVE THE POINTER · ESC TO CLOSE", "TYPE LETTERS TO FIRE · ESC TO CLOSE", "CHOOSE A GATE · ESC TO CLOSE"],
    levels: [
      {
        title: "Focus Field",
        instruction: "Move the pointer. Collect green signals and avoid violet noise.",
        wisdomTitle: "Feedback creates focus.",
        wisdom: "Children maintain attention longer when every action produces fast, clear and meaningful feedback.",
      },
      {
        title: "Code Blaster",
        instruction: "Type the falling word in order. Every correct letter fires the ship's laser.",
        wisdomTitle: "Fluency frees working memory.",
        wisdom: "When basic commands become familiar, learners can spend more attention on patterns, logic and creative problem solving.",
      },
      {
        title: "Python Gates",
        instruction: "Choose the gate with the correct result before the signal expires.",
        wisdomTitle: "Simple syntax frees the mind.",
        wisdom: "Python helps beginners focus on logic and problem solving instead of language complexity.",
      },
    ],
    finish: "Focus {focus}% · Words {pattern}/6 · Python {python}/3",
  },
  ru: {
    introTitle: "Три испытания.<br>Три полезных открытия.",
    introText: "Проверь внимание, распознавание паттернов и Python-логику за 90 секунд.",
    start: "Начать забег",
    level: "Уровень",
    next: "Следующий уровень",
    result: "Увидеть результат",
    controls: "МЫШЬ / КАСАНИЕ · ПРОБЕЛ ДЛЯ ПРЫЖКА · ESC — ВЫХОД",
    levelControls: ["ДВИГАЙ УКАЗАТЕЛЬ · ESC — ВЫХОД", "ПЕЧАТАЙ БУКВЫ ДЛЯ СТРЕЛЬБЫ · ESC — ВЫХОД", "ВЫБЕРИ ВОРОТА · ESC — ВЫХОД"],
    levels: [
      {
        title: "Поле внимания",
        instruction: "Двигай указатель. Собирай зелёные сигналы и избегай фиолетового шума.",
        wisdomTitle: "Обратная связь удерживает внимание.",
        wisdom: "Дети дольше сохраняют концентрацию, когда каждое действие получает быструю, понятную и значимую реакцию.",
      },
      {
        title: "Code Blaster",
        instruction: "Набирай падающее слово по порядку. Каждая правильная буква запускает лазер корабля.",
        wisdomTitle: "Беглость освобождает рабочую память.",
        wisdom: "Когда базовые команды становятся привычными, ученик тратит больше внимания на закономерности, логику и творческие решения.",
      },
      {
        title: "Ворота Python",
        instruction: "Выбери ворота с правильным результатом, пока сигнал не исчез.",
        wisdomTitle: "Простой синтаксис освобождает мышление.",
        wisdom: "Python помогает новичку сосредоточиться на логике и решении задач, а не на сложности языка.",
      },
    ],
    finish: "Внимание {focus}% · Слова {pattern}/6 · Python {python}/3",
  },
  pl: {
    introTitle: "Trzy wyzwania.<br>Trzy przydatne odkrycia.",
    introText: "Sprawdź koncentrację, rozpoznawanie wzorców i logikę Pythona w 90 sekund.",
    start: "Rozpocznij bieg",
    level: "Poziom",
    next: "Następny poziom",
    result: "Zobacz wynik",
    controls: "MYSZ / DOTYK · SPACJA — SKOK · ESC — WYJŚCIE",
    levelControls: ["PORUSZAJ WSKAŹNIKIEM · ESC — WYJŚCIE", "PISZ LITERY, ABY STRZELAĆ · ESC — WYJŚCIE", "WYBIERZ BRAMĘ · ESC — WYJŚCIE"],
    levels: [
      {
        title: "Pole skupienia",
        instruction: "Poruszaj wskaźnikiem. Zbieraj zielone sygnały i unikaj fioletowego szumu.",
        wisdomTitle: "Informacja zwrotna buduje skupienie.",
        wisdom: "Dzieci dłużej utrzymują uwagę, gdy każde działanie daje szybką, jasną i znaczącą reakcję.",
      },
      {
        title: "Code Blaster",
        instruction: "Wpisuj spadające słowo po kolei. Każda poprawna litera uruchamia laser statku.",
        wisdomTitle: "Płynność uwalnia pamięć roboczą.",
        wisdom: "Gdy podstawowe polecenia stają się znajome, uczeń może poświęcić więcej uwagi wzorcom, logice i twórczym rozwiązaniom.",
      },
      {
        title: "Bramy Pythona",
        instruction: "Wybierz bramę z poprawnym wynikiem, zanim sygnał zniknie.",
        wisdomTitle: "Prosta składnia uwalnia myślenie.",
        wisdom: "Python pozwala początkującym skupić się na logice i rozwiązywaniu problemów zamiast na złożoności języka.",
      },
    ],
    finish: "Skupienie {focus}% · Słowa {pattern}/6 · Python {python}/3",
  },
};

const PYTHON_QUESTIONS = [
  { code: 'len("AI")', options: ["1", "2", "3"], answer: "2" },
  { code: "3 + 2 * 2", options: ["10", "7", "8"], answer: "7" },
  { code: "2 ** 3", options: ["6", "8", "9"], answer: "8" },
];

const CODE_WORDS = ["CODE", "LOOP", "GAME", "LOGIC", "PIXEL", "PYTHON"];

export function initMindRunner() {
  const modal = document.querySelector("#mind-runner");
  if (!modal) return;

  const canvas = modal.querySelector("#game-canvas");
  const context = canvas.getContext("2d");
  const screens = [...modal.querySelectorAll("[data-game-screen]")];
  const answerBox = modal.querySelector(".game-answers");
  const avatar = new Image();
  avatar.src = "/static/images/avatar-game.jpg";

  const state = {
    open: false,
    level: 0,
    running: false,
    frame: 0,
    lastTime: 0,
    spawnAt: 0,
    score: 0,
    attempts: 0,
    mistakes: 0,
    entities: [],
    pointerY: canvas.height / 2,
    playerY: 350,
    velocityY: 0,
    question: 0,
    wordIndex: 0,
    letterIndex: 0,
    wordY: 80,
    wordX: 480,
    wordCompleteAt: 0,
    blasts: [],
    sparks: [],
    feedback: "",
    feedbackColor: "#c7ff38",
    feedbackUntil: 0,
    shake: 0,
    results: { focus: 100, pattern: 0, python: 0 },
  };

  const language = () => COPY[document.documentElement.lang] || COPY.en;

  function showScreen(name) {
    screens.forEach((screen) => {
      screen.hidden = screen.dataset.gameScreen !== name;
    });
  }

  function applyIntroCopy() {
    const copy = language();
    modal.querySelector(".game-intro-copy h3").innerHTML = copy.introTitle;
    modal.querySelector(".game-intro-copy > p:not(.game-overline)").textContent = copy.introText;
    modal.querySelector("[data-game-start]").childNodes[0].textContent = `${copy.start} `;
    modal.querySelector(".game-controls").textContent = copy.controls;
  }

  function openGame() {
    applyIntroCopy();
    resetGame();
    modal.hidden = false;
    document.body.classList.add("game-open");
    state.open = true;
    showScreen("intro");
    modal.querySelector("[data-game-start]").focus();
  }

  function closeGame() {
    state.open = false;
    state.running = false;
    modal.hidden = true;
    document.body.classList.remove("game-open");
    document.querySelector("#game-launch")?.focus();
  }

  function resetGame() {
    state.level = 0;
    state.results = { focus: 100, pattern: 0, python: 0 };
    updateProgress();
  }

  function startLevel(level) {
    cancelAnimationFrame(state.frame);
    state.level = level;
    state.running = true;
    state.score = 0;
    state.attempts = 0;
    state.mistakes = 0;
    state.entities = [];
    state.spawnAt = 0;
    state.lastTime = performance.now();
    state.pointerY = canvas.height / 2;
    state.playerY = 350;
    state.velocityY = 0;
    state.question = 0;
    state.wordIndex = 0;
    state.letterIndex = 0;
    state.wordY = 80;
    state.wordX = 480;
    state.wordCompleteAt = 0;
    state.blasts = [];
    state.sparks = [];
    state.feedback = "";
    state.shake = 0;
    answerBox.hidden = true;
    answerBox.innerHTML = "";
    updateProgress();
    updateStage();
    showScreen("play");

    if (level === 2) {
      showPythonQuestion();
    } else {
      if (level === 1 && window.matchMedia("(pointer: coarse)").matches) showShooterKeys();
      state.frame = requestAnimationFrame(gameLoop);
    }
  }

  function updateProgress() {
    modal.querySelectorAll(".game-levels i").forEach((step, index) => {
      step.classList.toggle("active", index === state.level);
      step.classList.toggle("done", index < state.level);
      step.textContent = index < state.level ? "✓" : String(index + 1);
    });
  }

  function updateStage() {
    const copy = language();
    const stage = copy.levels[state.level];
    modal.querySelector(".game-stage-number").textContent = `${copy.level.toUpperCase()} ${String(state.level + 1).padStart(2, "0")}`;
    modal.querySelector(".game-stage-title").textContent = stage.title;
    modal.querySelector(".game-instruction").textContent = stage.instruction;
    modal.querySelector(".game-controls").textContent = copy.levelControls[state.level];
    updateScore();
  }

  function updateScore() {
    const target = state.level === 2 ? 3 : state.level === 1 ? 6 : 8;
    modal.querySelector(".game-score").textContent = `${state.score} / ${target}`;
  }

  function gameLoop(time) {
    if (!state.running || !state.open || state.level === 2) return;
    const delta = Math.min((time - state.lastTime) / 16.67, 2);
    state.lastTime = time;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    if (state.shake > 0.2) {
      context.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
      state.shake *= 0.88;
    }
    drawWorld(time);

    if (state.level === 0) updateFocusLevel(time, delta);
    if (state.level === 1) updateCodeBlaster(time, delta);
    context.restore();
    drawFeedback(time);

    state.frame = requestAnimationFrame(gameLoop);
  }

  function drawWorld(time) {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#080c09");
    gradient.addColorStop(1, "#111022");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "rgba(199,255,56,.07)";
    context.lineWidth = 1;
    const offset = (time * 0.025) % 48;
    for (let x = -48 + offset; x < canvas.width; x += 48) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    for (let y = 28; y < canvas.height; y += 48) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
  }

  function drawAvatar(x, y, radius) {
    context.save();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.clip();
    if (avatar.complete) {
      context.drawImage(avatar, x - radius, y - radius, radius * 2, radius * 2);
    } else {
      context.fillStyle = "#c7ff38";
      context.fill();
    }
    context.restore();
    context.strokeStyle = "#c7ff38";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(x, y, radius + 3, 0, Math.PI * 2);
    context.stroke();
  }

  function triggerFeedback(text, color, collision = false) {
    state.feedback = text;
    state.feedbackColor = color;
    state.feedbackUntil = performance.now() + 650;
    if (collision) state.shake = 16;
  }

  function drawFeedback(time) {
    if (!state.feedback || time > state.feedbackUntil) return;
    const life = Math.max(0, (state.feedbackUntil - time) / 650);
    context.save();
    context.globalAlpha = Math.min(1, life * 1.8);
    context.fillStyle = state.feedbackColor;
    context.font = "700 24px Manrope";
    context.textAlign = "center";
    context.fillText(state.feedback, canvas.width / 2, 55 + (1 - life) * -15);
    context.restore();
  }

  function updateFocusLevel(time, delta) {
    state.pointerY += (Math.max(55, Math.min(canvas.height - 55, state.pointerY)) - state.pointerY) * 0.2;
    drawAvatar(120, state.pointerY, 34);

    if (time > state.spawnAt) {
      const good = Math.random() > 0.28;
      state.entities.push({ x: canvas.width + 40, y: 55 + Math.random() * (canvas.height - 110), good, radius: good ? 16 : 22 });
      state.spawnAt = time + 760;
    }

    state.entities.forEach((entity) => {
      entity.x -= 5.4 * delta;
      context.strokeStyle = entity.good ? "#c7ff38" : "#9c7bff";
      context.fillStyle = entity.good ? "rgba(199,255,56,.2)" : "rgba(156,123,255,.18)";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      if (!entity.hit && Math.hypot(entity.x - 120, entity.y - state.pointerY) < entity.radius + 34) {
        entity.hit = true;
        state.attempts += 1;
        if (entity.good) {
          state.score += 1;
          triggerFeedback("SIGNAL +1", "#c7ff38");
        } else {
          state.mistakes += 1;
          state.score = Math.max(0, state.score - 1);
          triggerFeedback("NOISE · -1", "#9c7bff", true);
        }
        updateScore();
      }
    });
    state.entities = state.entities.filter((entity) => entity.x > -50 && !entity.hit);
    if (state.score >= 8) {
      state.results.focus = Math.max(40, Math.round((8 / Math.max(8 + state.mistakes, 8)) * 100));
      completeLevel();
    }
  }

  function updateCodeBlaster(time, delta) {
    drawStarTunnel(time);
    drawShip(canvas.width / 2, canvas.height - 54, time);
    updateBlasts(delta);
    updateSparks(delta);

    if (state.wordCompleteAt) {
      if (time >= state.wordCompleteAt) {
        state.wordCompleteAt = 0;
        state.wordIndex += 1;
        state.letterIndex = 0;
        state.wordY = 76;
        state.wordX = 240 + Math.random() * 480;
        if (state.wordIndex >= CODE_WORDS.length) {
          state.results.pattern = state.score;
          answerBox.hidden = true;
          completeLevel();
        } else if (window.matchMedia("(pointer: coarse)").matches) {
          showShooterKeys();
        }
      }
      return;
    }

    const word = CODE_WORDS[state.wordIndex];
    state.wordY += 0.42 * delta;
    drawFallingWord(word);

    if (state.wordY > canvas.height - 118) {
      state.mistakes += 1;
      state.letterIndex = 0;
      state.wordY = 72;
      state.wordX = 240 + Math.random() * 480;
      triggerFeedback("HULL HIT · WORD RESET", "#9c7bff", true);
      if (window.matchMedia("(pointer: coarse)").matches) showShooterKeys();
    }
  }

  function drawStarTunnel(time) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.42;
    context.save();
    for (let index = 0; index < 54; index += 1) {
      const phase = ((time * 0.00012 + index / 54) % 1);
      const angle = index * 2.399;
      const distance = phase * 520;
      const x = centerX + Math.cos(angle) * distance * 1.45;
      const y = centerY + Math.sin(angle) * distance * 0.7;
      const size = 0.6 + phase * 3.3;
      context.fillStyle = index % 5 === 0 ? `rgba(199,255,56,${phase})` : `rgba(238,244,232,${phase * 0.7})`;
      context.fillRect(x, y, size, size);
    }
    context.strokeStyle = "rgba(156,123,255,.12)";
    [80, 150, 240].forEach((radius) => {
      context.beginPath();
      context.ellipse(centerX, centerY, radius * 1.65, radius * 0.7, 0, 0, Math.PI * 2);
      context.stroke();
    });
    context.restore();
  }

  function drawShip(x, y, time) {
    const glow = context.createRadialGradient(x, y, 4, x, y, 70);
    glow.addColorStop(0, "rgba(199,255,56,.3)");
    glow.addColorStop(1, "rgba(199,255,56,0)");
    context.fillStyle = glow;
    context.fillRect(x - 75, y - 75, 150, 150);

    context.save();
    context.translate(x, y + Math.sin(time * 0.006) * 3);
    context.shadowColor = "#9c7bff";
    context.shadowBlur = 18;
    const shipGradient = context.createLinearGradient(-42, 0, 42, 0);
    shipGradient.addColorStop(0, "#5d43a8");
    shipGradient.addColorStop(0.5, "#eef4e8");
    shipGradient.addColorStop(1, "#a9dc27");
    context.fillStyle = shipGradient;
    context.beginPath();
    context.moveTo(0, -42);
    context.lineTo(42, 30);
    context.lineTo(14, 20);
    context.lineTo(0, 34);
    context.lineTo(-14, 20);
    context.lineTo(-42, 30);
    context.closePath();
    context.fill();
    context.fillStyle = "#080b0a";
    context.beginPath();
    context.ellipse(0, -6, 10, 17, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#c7ff38";
    context.fillRect(-20, 29, 8, 18 + Math.random() * 7);
    context.fillRect(12, 29, 8, 18 + Math.random() * 7);
    context.restore();
  }

  function drawFallingWord(word) {
    const typed = word.slice(0, state.letterIndex);
    const remaining = word.slice(state.letterIndex);
    context.save();
    context.textAlign = "center";
    context.font = "700 42px monospace";
    context.shadowBlur = 22;
    context.shadowColor = "#9c7bff";
    const typedWidth = context.measureText(typed).width;
    const remainingWidth = context.measureText(remaining).width;
    const totalWidth = typedWidth + remainingWidth;
    const startX = state.wordX - totalWidth / 2;
    context.textAlign = "left";
    context.fillStyle = "rgba(146,155,144,.32)";
    context.fillText(typed, startX, state.wordY);
    context.fillStyle = "#eef4e8";
    context.fillText(remaining, startX + typedWidth, state.wordY);
    if (remaining) {
      const cursorX = startX + typedWidth + context.measureText(remaining[0]).width / 2;
      context.fillStyle = "#c7ff38";
      context.fillRect(cursorX - 14, state.wordY + 10, 28, 3);
    }
    context.restore();
  }

  function handleTyping(key) {
    if (!state.running || state.level !== 1 || state.wordCompleteAt) return;
    const word = CODE_WORDS[state.wordIndex];
    const expected = word[state.letterIndex];
    if (key.toUpperCase() === expected) {
      state.blasts.push({ x: canvas.width / 2, y: canvas.height - 90, tx: state.wordX, ty: state.wordY - 12, progress: 0 });
      state.letterIndex += 1;
      triggerFeedback(`${expected} · HIT`, "#c7ff38");
      if (state.letterIndex >= word.length) {
        state.score += 1;
        updateScore();
        createExplosion(state.wordX, state.wordY);
        triggerFeedback(`${word} · DESTROYED`, "#c7ff38");
        state.wordCompleteAt = performance.now() + 700;
      }
      if (window.matchMedia("(pointer: coarse)").matches) showShooterKeys();
    } else if (/^[a-z]$/i.test(key)) {
      state.mistakes += 1;
      triggerFeedback(`EXPECTED ${expected}`, "#ff6688", true);
    }
  }

  function updateBlasts(delta) {
    state.blasts.forEach((blast) => {
      blast.progress = Math.min(1, blast.progress + 0.12 * delta);
      const x = blast.x + (blast.tx - blast.x) * blast.progress;
      const y = blast.y + (blast.ty - blast.y) * blast.progress;
      context.strokeStyle = "#c7ff38";
      context.shadowColor = "#c7ff38";
      context.shadowBlur = 16;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(blast.x, blast.y);
      context.lineTo(x, y);
      context.stroke();
      context.shadowBlur = 0;
    });
    state.blasts = state.blasts.filter((blast) => blast.progress < 1);
  }

  function createExplosion(x, y) {
    for (let index = 0; index < 24; index += 1) {
      const angle = (index / 24) * Math.PI * 2;
      state.sparks.push({ x, y, vx: Math.cos(angle) * (2 + Math.random() * 4), vy: Math.sin(angle) * (2 + Math.random() * 4), life: 1 });
    }
  }

  function updateSparks(delta) {
    state.sparks.forEach((spark) => {
      spark.x += spark.vx * delta;
      spark.y += spark.vy * delta;
      spark.life -= 0.035 * delta;
      context.globalAlpha = Math.max(0, spark.life);
      context.fillStyle = Math.random() > 0.45 ? "#c7ff38" : "#9c7bff";
      context.fillRect(spark.x, spark.y, 4, 4);
      context.globalAlpha = 1;
    });
    state.sparks = state.sparks.filter((spark) => spark.life > 0);
  }

  function showShooterKeys() {
    const word = CODE_WORDS[state.wordIndex] || "";
    const expected = word[state.letterIndex] || "";
    const alphabet = [...new Set([expected, ...word.split("").reverse()])].slice(0, 5);
    answerBox.innerHTML = "";
    answerBox.classList.add("shooter-keys");
    alphabet.sort(() => Math.random() - 0.5).forEach((letter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = letter;
      button.addEventListener("click", () => handleTyping(letter));
      answerBox.append(button);
    });
    answerBox.hidden = false;
  }

  function showPythonQuestion() {
    const question = PYTHON_QUESTIONS[state.question];
    drawWorld(performance.now());
    context.fillStyle = "#929b90";
    context.font = "700 13px Manrope";
    context.textAlign = "center";
    context.fillText("CHOOSE THE OUTPUT", canvas.width / 2, 120);
    context.fillStyle = "#eef4e8";
    context.font = "600 52px monospace";
    context.fillText(question.code, canvas.width / 2, 225);
    context.strokeStyle = "rgba(199,255,56,.25)";
    context.strokeRect(canvas.width / 2 - 230, 160, 460, 100);

    answerBox.innerHTML = "";
    answerBox.classList.remove("shooter-keys");
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => answerPython(option));
      answerBox.append(button);
    });
    answerBox.hidden = false;
  }

  function answerPython(answer) {
    const question = PYTHON_QUESTIONS[state.question];
    if (answer === question.answer) {
      state.score += 1;
    } else {
      state.mistakes += 1;
    }
    updateScore();
    state.question += 1;
    if (state.question >= PYTHON_QUESTIONS.length) {
      state.results.python = state.score;
      answerBox.hidden = true;
      completeLevel();
    } else {
      showPythonQuestion();
    }
  }

  function completeLevel() {
    state.running = false;
    cancelAnimationFrame(state.frame);
    const stage = language().levels[state.level];
    modal.querySelector(".wisdom-title").textContent = stage.wisdomTitle;
    modal.querySelector(".wisdom-text").textContent = stage.wisdom;
    const rewards = [
      `${stage.title} · ${state.results.focus}%`,
      `${stage.title} · ${state.results.pattern}/6`,
      `${stage.title} · ${state.results.python}/3`,
    ];
    modal.querySelector(".wisdom-reward").textContent = rewards[state.level];
    const next = modal.querySelector("[data-game-next]");
    next.childNodes[0].textContent = `${state.level === 2 ? language().result : language().next} `;
    showScreen("wisdom");
  }

  function finishGame() {
    const template = language().finish;
    modal.querySelector(".finish-stats").textContent = template
      .replace("{focus}", state.results.focus)
      .replace("{pattern}", state.results.pattern)
      .replace("{python}", state.results.python);
    modal.querySelectorAll(".game-levels i").forEach((step) => {
      step.classList.remove("active");
      step.classList.add("done");
      step.textContent = "✓";
    });
    showScreen("finish");
  }

  function mapPointer(event) {
    const rect = canvas.getBoundingClientRect();
    state.pointerY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  }

  document.querySelector("#game-launch")?.addEventListener("click", openGame);
  document.querySelector("#game-launch-label")?.addEventListener("click", openGame);
  modal.querySelector("[data-game-start]").addEventListener("click", () => startLevel(0));
  modal.querySelector("[data-game-next]").addEventListener("click", () => {
    if (state.level >= 2) finishGame();
    else startLevel(state.level + 1);
  });
  modal.querySelector("[data-game-restart]").addEventListener("click", () => {
    resetGame();
    startLevel(0);
  });
  modal.querySelectorAll("[data-game-close]").forEach((button) => button.addEventListener("click", closeGame));
  canvas.addEventListener("pointermove", mapPointer);
  canvas.addEventListener("pointerdown", (event) => {
    mapPointer(event);
  });
  window.addEventListener("keydown", (event) => {
    if (!state.open) return;
    if (event.key === "Escape") closeGame();
    if (state.level === 1 && /^[a-z]$/i.test(event.key)) {
      event.preventDefault();
      handleTyping(event.key);
    } else if (event.code === "Space") {
      event.preventDefault();
    }
  });
}
