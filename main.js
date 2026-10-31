/* ==========================================================
   OUR LITTLE FOREVER 💗
   OPTIMIZED COMPLETE MAIN.JS
   Made by Ankit for Sulochana Raut

   - Lazy-loaded 21-photo album
   - Smooth photo navigation
   - Automatic looping background music
   - Scratch photo reveal
   - All birthday surprises
   ========================================================== */

"use strict";

/* ================= CONFIG ================= */

const CONFIG = {
  name: "Sulochana Raut",
  creator: "Ankit",

  birthday: {
    year: 2063,
    month: 7,
    day: 20
  },

  photoCount: 21,
  photoFolder: "assets/photos/",
  scratchPhoto: "assets/photos/scratch.jpg",
  music: "assets/music/love.mp3",
  musicVolume: 0.5
};

/* ================= HELPERS ================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

const random = (min, max) =>
  Math.random() * (max - min) + min;

function show(element) {
  element?.classList.remove("hidden");
}

function hide(element) {
  element?.classList.add("hidden");
}

function bindClick(selector, callback) {
  const element = $(selector);

  if (element) {
    element.addEventListener("click", callback);
  }
}

/* ================= STATE ================= */

const state = {
  albumIndex: 0,
  photos: [],

  movieIndex: 0,
  movieTimer: null,
  moviePlaying: false,

  nicknameAnswered: false,
  scratchReady: false,
  scratchCompleted: false,

  candleBlown: false,
  giftOpened: false,

  musicManuallyPaused: false
};

/* ================= PHOTO PATHS ================= */

/*
  IMPORTANT:
  Creating image paths does NOT download the photos.

  Only assigning a path to an <img> element
  or creating a preload Image() starts a request.
*/

const PHOTO_PATHS = Array.from(
  { length: CONFIG.photoCount },
  (_, index) =>
    `${CONFIG.photoFolder}photo${index + 1}.jpg`
);

const captions = [
  "My beautiful Sanu 💗",
  "Your smile is my favourite view 🌸",
  "Every picture tells a little love story.",
  "My sweetest Motuu 🥹",
  "A memory worth keeping forever.",
  "You make my world beautiful.",
  "My one and only Kanxu ❤️",
  "A thousand feelings in one picture.",
  "Forever my favourite person.",
  "Every moment with you is precious.",
  "A smile that melts my heart.",
  "The cutest chapter of my life.",
  "Little memories, endless love.",
  "My happiness looks like you.",
  "A beautiful soul, a beautiful smile.",
  "I wish I could pause this moment.",
  "You make everything better.",
  "My favourite notification and person.",
  "Our little forever 💕",
  "Ankit ❤️ Sulochana",
  "Our beautiful story continues forever. 💗"
];

/* ================= PAGE NAVIGATION ================= */

const pages = {
  welcome: $("#welcomePage"),
  calendar: $("#calendarPage"),
  nickname: $("#nicknamePage"),
  birthday: $("#birthdayPage"),
  main: $("#mainWebsite")
};

function changePage(name) {
  Object.entries(pages).forEach(([key, element]) => {
    if (key === name) {
      show(element);
    } else {
      hide(element);
    }
  });

  window.scrollTo(0, 0);

  if (name === "main") {
    setTimeout(() => {
      initializeScratchSurface();
      refreshReveals();
      drawSkyStars();
    }, 200);
  }
}

/* ================= MUSIC ================= */

let music = null;

function initializeMusic() {
  music = $("#backgroundMusic");

  if (!music) return;

  music.loop = true;
  music.volume = CONFIG.musicVolume;
  music.preload = "auto";

  const player = $("#musicPlayer");
  const toggle = $("#musicToggle");
  const volume = $("#volumeControl");

  show(player);

  if (volume) {
    volume.value = CONFIG.musicVolume;

    volume.addEventListener("input", () => {
      music.volume = Number(volume.value);
    });
  }

  toggle?.addEventListener("click", () => {
    if (music.paused) {
      state.musicManuallyPaused = false;
      playMusic();
    } else {
      pauseMusic();
    }
  });

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);

  music.addEventListener("ended", () => {
    if (!state.musicManuallyPaused) {
      music.currentTime = 0;
      playMusic();
    }
  });

  music.addEventListener("error", () => {
    console.error("Could not load music:", CONFIG.music);
  });

  music.load();

  // Browsers may block audible autoplay.
  playMusic();
}

async function playMusic() {
  if (!music || state.musicManuallyPaused) return;

  if (!music.paused) {
    updateMusicButton();
    return;
  }

  try {
    await music.play();
    updateMusicButton();
  } catch {
    updateMusicButton();
  }
}

function pauseMusic() {
  if (!music) return;

  state.musicManuallyPaused = true;
  music.pause();
  updateMusicButton();
}

function updateMusicButton() {
  const button = $("#musicToggle");

  if (!button || !music) return;

  const playing = !music.paused;

  button.textContent = playing ? "⏸" : "🎵";
  button.classList.toggle("playing", playing);

  button.setAttribute(
    "aria-label",
    playing ? "Pause music" : "Play music"
  );
}

/* ================= WELCOME ================= */

function initializeWelcome() {
  bindClick("#beginSurpriseBtn", () => {
    // Start music inside a user gesture if autoplay was blocked.
    playMusic();

    heartBurst(
      window.innerWidth / 2,
      window.innerHeight / 2
    );

    setTimeout(() => changePage("calendar"), 350);
  });

  const element = $("#welcomeTypingText");

  if (!element) return;

  const text =
    "Some surprises are made with love... and this one is only for you, Sanu. 💗";

  element.textContent = "";

  let index = 0;

  function typeNext() {
    if (index >= text.length) return;

    element.textContent += text[index++];
    setTimeout(typeNext, 45);
  }

  setTimeout(typeNext, 500);
}

/* ================= FLOATING HEARTS ================= */

function initializeHearts() {
  const container = $("#floatingHearts");

  if (!container) return;

  const emojis = ["💗", "💕", "🌸", "💖", "🩷"];

  setInterval(() => {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent =
      emojis[Math.floor(Math.random() * emojis.length)];

    heart.style.left = `${random(0, 100)}%`;
    heart.style.fontSize = `${random(13, 26)}px`;
    heart.style.animationDuration = `${random(7, 13)}s`;

    container.appendChild(heart);

    setTimeout(() => heart.remove(), 14000);
  }, window.innerWidth <= 650 ? 2200 : 1400);
}

function heartBurst(x, y) {
  const emojis = ["💗", "💕", "✨", "🌸"];

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");

    heart.className = "burst-heart";
    heart.textContent =
      emojis[Math.floor(Math.random() * emojis.length)];

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    const angle = random(0, Math.PI * 2);
    const distance = random(60, 220);

    heart.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(.5)",
          opacity: 1
        },
        {
          transform:
            `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.3)`,
          opacity: 0
        }
      ],
      {
        duration: 1200,
        easing: "ease-out"
      }
    ).onfinish = () => heart.remove();
  }
}

/* ================= CALENDAR ================= */

function initializeCalendar() {
  const yearSelect = $("#bsYear");
  const monthSelect = $("#bsMonth");
  const daysContainer = $("#calendarDays");
  const selectedText = $("#selectedDateText");
  const feedback = $("#calendarFeedback");

  if (!yearSelect || !monthSelect || !daysContainer) return;

  let selectedDay = null;

  for (let year = 2055; year <= 2075; year++) {
    const option = document.createElement("option");

    option.value = year;
    option.textContent = `${year} BS`;

    yearSelect.appendChild(option);
  }

  function updateSelectedText() {
    if (!selectedText) return;

    if (!selectedDay) {
      selectedText.textContent = "Select your special date 💗";
      return;
    }

    const month =
      monthSelect.options[monthSelect.selectedIndex]?.textContent ||
      "Month";

    selectedText.textContent =
      `${yearSelect.value || "Year"} / ${month} / ${selectedDay}`;
  }

  function renderDays() {
    daysContainer.innerHTML = "";
    selectedDay = null;

    // Date selector only; not a verified historical BS calendar.
    for (let day = 1; day <= 32; day++) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "calendar-day";
      button.textContent = day;

      button.addEventListener("click", () => {
        $$(".calendar-day", daysContainer).forEach(item =>
          item.classList.remove("selected")
        );

        button.classList.add("selected");
        selectedDay = day;

        if (feedback) feedback.textContent = "";

        updateSelectedText();
      });

      daysContainer.appendChild(button);
    }
  }

  yearSelect.addEventListener("change", updateSelectedText);

  monthSelect.addEventListener("change", () => {
    renderDays();
    updateSelectedText();
  });

  renderDays();

  bindClick("#unlockBtn", () => {
    playMusic();

    const correct =
      Number(yearSelect.value) === CONFIG.birthday.year &&
      Number(monthSelect.value) === CONFIG.birthday.month &&
      selectedDay === CONFIG.birthday.day;

    if (correct) {
      if (feedback) {
        feedback.textContent = "You unlocked Ankit's heart! ❤️";
        feedback.className = "calendar-feedback success";
      }

      confetti();
      setTimeout(() => changePage("nickname"), 900);
    } else {
      if (feedback) {
        feedback.textContent =
          "Oops Sanu! 🥹 That's not the special date. Try again! 💗";
        feedback.className = "calendar-feedback error";
      }

      const card = $(".calendar-card");

      if (card) {
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
      }
    }
  });
}

/* ================= NICKNAME ================= */

function initializeNickname() {
  const buttons = $$(".nickname-btn");
  const result = $("#nicknameResult");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      playMusic();

      buttons.forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");

      show(result);

      if (!state.nicknameAnswered) {
        state.nicknameAnswered = true;
        confetti();
      }
    });
  });

  bindClick("#enterHeartBtn", () => {
    playMusic();
    changePage("birthday");
    confetti();
    fireworks();
  });
}

/* ================= BIRTHDAY ================= */

function initializeBirthday() {
  bindClick("#exploreWorldBtn", () => {
    playMusic();
    changePage("main");
    setTimeout(confetti, 300);
  });
}

/* ================= PHOTO LAZY LOADING ================= */

/*
  Keep a small in-memory cache of requested photos.

  The website no longer checks all 21 images during startup.
*/

const imageCache = new Map();

function preloadPhoto(index) {
  if (index < 0 || index >= PHOTO_PATHS.length) {
    return Promise.resolve(false);
  }

  if (imageCache.has(index)) {
    return imageCache.get(index);
  }

  const promise = new Promise(resolve => {
    const image = new Image();

    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);

    image.src = PHOTO_PATHS[index];
  });

  imageCache.set(index, promise);

  return promise;
}

function preloadNearbyPhotos() {
  const step = getAlbumStep();

  const nextIndex = state.albumIndex + step;

  // Preload only the next page, not all 21 photos.
  for (let i = nextIndex; i < nextIndex + step; i++) {
    if (i < PHOTO_PATHS.length) {
      preloadPhoto(i);
    }
  }
}

/* ================= ALBUM ================= */

function getAlbumStep() {
  return window.innerWidth <= 650 ? 1 : 2;
}

function createAlbumEndingPage() {
  const page = document.createElement("div");

  page.className = "album-page album-ending-page";

  page.style.justifyContent = "center";
  page.style.textAlign = "center";

  page.innerHTML = `
    <div style="padding:30px 15px;text-align:center">

      <div style="font-size:60px;margin-bottom:20px">
        💗
      </div>

      <h3 style="
        color:#e83e83;
        font-size:clamp(28px,4vw,44px);
        margin-bottom:20px
      ">
        Ankit & Sulochana
      </h3>

      <p style="
        color:#9b6a80;
        font-size:17px;
        line-height:2
      ">
        Our memories don't end here.
        The most beautiful chapters
        are still waiting to be written.
      </p>

      <p style="
        font-family:'Great Vibes',cursive;
        color:#e83e83;
        font-size:38px;
        margin-top:30px
      ">
        Forever Yours, Ankit ❤️
      </p>

    </div>
  `;

  return page;
}

function renderAlbum() {
  const container = $("#albumPages");
  const pageNumber = $("#albumPageNumber");

  if (!container) return;

  container.innerHTML = "";

  const step = getAlbumStep();

  const currentPage =
    Math.floor(state.albumIndex / step) + 1;

  const totalPages =
    Math.ceil(PHOTO_PATHS.length / step);

  for (let offset = 0; offset < step; offset++) {
    const index = state.albumIndex + offset;

    if (index >= PHOTO_PATHS.length) {
      if (step === 2) {
        container.appendChild(createAlbumEndingPage());
      }
      break;
    }

    const page = document.createElement("div");
    page.className = "album-page";

    const image = document.createElement("img");

    image.src = PHOTO_PATHS[index];
    image.alt = `Sanu memory ${index + 1}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;

    image.onerror = () => {
      image.alt = `Photo ${index + 1} could not be loaded`;
      console.warn("Missing photo:", PHOTO_PATHS[index]);
    };

    image.addEventListener("click", () => {
      openPhotoModal(index);
    });

    const caption = document.createElement("p");

    caption.className = "album-caption";
    caption.textContent = captions[index % captions.length];

    page.appendChild(image);
    page.appendChild(caption);

    container.appendChild(page);
  }

  if (pageNumber) {
    pageNumber.textContent =
      `Page ${currentPage} of ${totalPages}`;
  }

  preloadNearbyPhotos();
}

function initializeAlbum() {
  const cover = $("#albumCover");
  const book = $("#albumBook");

  bindClick("#openAlbumBtn", () => {
    hide(cover);
    show(book);

    state.albumIndex = 0;
    renderAlbum();
  });

  bindClick("#nextPageBtn", () => {
    const step = getAlbumStep();

    state.albumIndex += step;

    if (state.albumIndex >= PHOTO_PATHS.length) {
      state.albumIndex = 0;
    }

    renderAlbum();
  });

  bindClick("#prevPageBtn", () => {
    const step = getAlbumStep();

    state.albumIndex -= step;

    if (state.albumIndex < 0) {
      state.albumIndex =
        Math.floor((PHOTO_PATHS.length - 1) / step) * step;
    }

    renderAlbum();
  });

  const pages = $("#albumPages");

  if (pages) {
    let startX = 0;

    pages.addEventListener("touchstart", event => {
      startX = event.changedTouches[0].screenX;
    }, { passive: true });

    pages.addEventListener("touchend", event => {
      const endX = event.changedTouches[0].screenX;

      if (Math.abs(startX - endX) < 50) return;

      if (startX > endX) {
        $("#nextPageBtn")?.click();
      } else {
        $("#prevPageBtn")?.click();
      }
    }, { passive: true });
  }

  window.addEventListener("resize", () => {
    const step = getAlbumStep();

    state.albumIndex =
      Math.floor(state.albumIndex / step) * step;

    if (!$("#albumBook")?.classList.contains("hidden")) {
      renderAlbum();
    }
  });
}

/* ================= PHOTO MODAL ================= */

function openPhotoModal(index) {
  const modal = $("#photoModal");
  const image = $("#modalPhoto");
  const caption = $("#modalCaption");

  if (!modal || !image) return;

  image.src = PHOTO_PATHS[index];

  if (caption) {
    caption.textContent = captions[index % captions.length];
  }

  show(modal);
  document.body.style.overflow = "hidden";
}

function closePhotoModal() {
  hide($("#photoModal"));
  document.body.style.overflow = "";
}

function initializePhotoModal() {
  bindClick("#closePhotoModal", closePhotoModal);

  $("#photoModal")?.addEventListener("click", event => {
    if (event.target.id === "photoModal") {
      closePhotoModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closePhotoModal();
    }
  });
}

/* ================= LOVE MOVIE ================= */

function initializeMovie() {
  const image = $("#movieImage");
  const button = $("#playMovieBtn");
  const caption = $("#movieCaption");
  const progress = $("#movieProgressBar");

  if (!image || !button) return;

  /*
    Load the first movie photo only when the
    movie section approaches the viewport.
  */

  let movieInitialized = false;

  function prepareMovie() {
    if (movieInitialized) return;

    movieInitialized = true;

    image.src = PHOTO_PATHS[0];
    image.decoding = "async";

    if (caption) {
      caption.textContent = captions[0];
    }

    if (progress) {
      progress.style.width = `${100 / PHOTO_PATHS.length}%`;
    }
  }

  const section = $("#movieSection");

  if ("IntersectionObserver" in window && section) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        prepareMovie();
        observer.disconnect();
      }
    }, { rootMargin: "250px" });

    observer.observe(section);
  } else {
    bindClick("#playMovieBtn", prepareMovie);
  }

  function updateMovie() {
    image.classList.add("movie-changing");

    setTimeout(() => {
      image.src = PHOTO_PATHS[state.movieIndex];

      if (caption) {
        caption.textContent =
          captions[state.movieIndex % captions.length];
      }

      if (progress) {
        progress.style.width =
          `${((state.movieIndex + 1) / PHOTO_PATHS.length) * 100}%`;
      }

      image.classList.remove("movie-changing");
    }, 280);
  }

  function stopMovie() {
    clearInterval(state.movieTimer);
    state.movieTimer = null;
    state.moviePlaying = false;
    button.textContent = "▶";
  }

  function startMovie() {
    prepareMovie();

    if (state.moviePlaying) return;

    state.moviePlaying = true;
    button.textContent = "⏸";

    playMusic();

    state.movieTimer = setInterval(() => {
      state.movieIndex =
        (state.movieIndex + 1) % PHOTO_PATHS.length;

      updateMovie();
    }, 3200);
  }

  button.addEventListener("click", () => {
    if (state.moviePlaying) {
      stopMovie();
    } else {
      startMovie();
    }
  });

  // Pause the slideshow while the tab is hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.moviePlaying) {
      stopMovie();
    }
  });
}

/* ================= LOVE LETTER ================= */

function initializeLetter() {
  const button = $("#openLetterBtn");
  const letter = $("#loveLetter");

  if (!button || !letter) return;

  button.addEventListener("click", () => {
    const opened = !letter.classList.contains("hidden");

    if (opened) {
      hide(letter);
      button.classList.remove("opened");
    } else {
      show(letter);
      button.classList.add("opened");

      const rect = button.getBoundingClientRect();

      heartBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
    }
  });
}

/* ================= 20 LOVE REASONS ================= */

const reasons = [
  "Your smile makes everything better. 💗",
  "Your voice feels like my favourite song.",
  "You make ordinary moments special.",
  "Your happiness matters so much to me.",
  "Your cute reactions always make me smile.",
  "You are my favourite notification.",
  "Your presence feels like home.",
  "You make my heart happy.",
  "I love your little habits.",
  "Every conversation with you matters.",
  "You make beautiful memories with me.",
  "You are my favourite thought.",
  "I love your kindness.",
  "You are beautiful inside and out.",
  "You make life feel more colourful.",
  "I love seeing you smile.",
  "You are my Sanu, Motuu and Kanxu.",
  "You make simple days unforgettable.",
  "My heart always chooses you.",
  "Because you are my Sulochana. ❤️"
];

function initializeReasons() {
  const grid = $("#reasonsGrid");

  if (!grid) return;

  reasons.forEach((reason, index) => {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "reason-card";

    card.innerHTML = `
      <span class="reason-inner">
        <span class="reason-front">
          <span class="reason-icon">💗</span>
          <strong>Reason ${index + 1}</strong>
          <small>Tap to reveal</small>
        </span>

        <span class="reason-back">${reason}</span>
      </span>
    `;

    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    grid.appendChild(card);
  });
}

/* ================= LOVE JAR ================= */

const loveNotes = [
  "Sanu, you're my favourite person. 💗",
  "Motuu, your happiness means everything.",
  "Kanxu, never stop smiling. 🌸",
  "I wish I could hug you right now.",
  "You make my days brighter.",
  "My heart always chooses you.",
  "You are my sweetest blessing.",
  "I love our little conversations.",
  "From Pashupatinath to my heart. ❤️",
  "Our first meeting will always be special.",
  "Your Hello made my heart smile.",
  "You are my favourite memory.",
  "I hope all your dreams come true.",
  "You deserve endless happiness.",
  "Every moment with you is precious.",
  "Your smile is my favourite view.",
  "I am grateful that we met.",
  "You make everything feel magical.",
  "I love your cute little reactions.",
  "You are a beautiful part of my life.",
  "I want to make more memories with you.",
  "Never forget how special you are.",
  "You make my heart feel at home.",
  "I hope today is as beautiful as your smile.",
  "My favourite chapter is you.",
  "You make ordinary moments unforgettable.",
  "You are my one and only Sulochana.",
  "I wish you success, happiness and love.",
  "Our little forever is my favourite dream.",
  "I love you, Sulochana. Always. ❤️"
];

function initializeLoveJar() {
  const button = $("#loveJarBtn");
  const message = $("#jarMessage");

  if (!button || !message) return;

  let lastIndex = -1;

  button.addEventListener("click", () => {
    let index;

    do {
      index = Math.floor(Math.random() * loveNotes.length);
    } while (index === lastIndex);

    lastIndex = index;

    message.textContent = loveNotes[index];

    show(message);

    message.classList.remove("note-appear");
    void message.offsetWidth;
    message.classList.add("note-appear");
  });
}

/* ================= SCRATCH PHOTO ================= */

let scratchCanvas = null;
let scratchContext = null;
let scratchDrawing = false;
let scratchPrevious = null;
let scratchDistance = 0;

function initializeScratch() {
  scratchCanvas = $("#scratchCanvas");

  const card = $(".scratch-card");
  const message = $(".scratch-message");

  if (!scratchCanvas || !card || !message) return;

  message.innerHTML = `
    <div class="scratch-photo-reveal">
      <img
        src="${CONFIG.scratchPhoto}"
        class="scratch-secret-photo"
        alt="Special photo of Sulochana"
        draggable="false"
      >

      <div class="scratch-photo-shade"></div>

      <div class="scratch-photo-message">
        <span>💗</span>
        <h3>My Favourite Forever</h3>
        <p>I Love You, Sanu! ❤️</p>
      </div>
    </div>
  `;

  const image = $(".scratch-secret-photo");

  image.onerror = () => {
    console.warn("Scratch photo missing:", CONFIG.scratchPhoto);

    image.style.display = "none";

    $(".scratch-photo-reveal").style.background =
      "linear-gradient(135deg,#ffc4dc,#ff82b1)";
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        initializeScratchSurface();

        if (state.scratchReady) {
          observer.disconnect();
        }
      }
    });

    observer.observe(card);
  }

  scratchCanvas.addEventListener("pointerdown", event => {
    if (state.scratchCompleted) return;

    initializeScratchSurface();

    if (!state.scratchReady) return;

    event.preventDefault();

    scratchDrawing = true;
    scratchPrevious = getScratchPoint(event);

    try {
      scratchCanvas.setPointerCapture(event.pointerId);
    } catch {
      // Optional pointer capture.
    }

    eraseCircle(scratchPrevious.x, scratchPrevious.y);
  });

  scratchCanvas.addEventListener("pointermove", event => {
    if (!scratchDrawing || state.scratchCompleted || !scratchContext) {
      return;
    }

    event.preventDefault();

    const point = getScratchPoint(event);

    scratchContext.globalCompositeOperation = "destination-out";
    scratchContext.lineWidth = 38;
    scratchContext.lineCap = "round";
    scratchContext.lineJoin = "round";

    scratchContext.beginPath();
    scratchContext.moveTo(scratchPrevious.x, scratchPrevious.y);
    scratchContext.lineTo(point.x, point.y);
    scratchContext.stroke();

    const dx = point.x - scratchPrevious.x;
    const dy = point.y - scratchPrevious.y;

    scratchDistance += Math.sqrt(dx * dx + dy * dy);
    scratchPrevious = point;

    if (
      scratchDistance >
      Math.max(
        400,
        scratchCanvas.clientWidth *
        scratchCanvas.clientHeight / 110
      )
    ) {
      completeScratch();
    }
  });

  function stopDrawing() {
    scratchDrawing = false;
    scratchPrevious = null;
  }

  scratchCanvas.addEventListener("pointerup", stopDrawing);
  scratchCanvas.addEventListener("pointercancel", stopDrawing);

  window.addEventListener("resize", () => {
    if (state.scratchReady && !state.scratchCompleted) {
      paintScratch();
    }
  });
}

function initializeScratchSurface() {
  if (!scratchCanvas || state.scratchReady || state.scratchCompleted) {
    return;
  }

  const rect = scratchCanvas.getBoundingClientRect();

  if (rect.width < 10 || rect.height < 10) return;

  paintScratch();
  state.scratchReady = true;
}

function paintScratch() {
  if (!scratchCanvas) return;

  const rect = scratchCanvas.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  scratchCanvas.width = Math.round(rect.width * ratio);
  scratchCanvas.height = Math.round(rect.height * ratio);

  scratchContext = scratchCanvas.getContext("2d");
  scratchContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  scratchContext.globalCompositeOperation = "source-over";

  const gradient = scratchContext.createLinearGradient(
    0, 0, rect.width, rect.height
  );

  gradient.addColorStop(0, "#ffb5d1");
  gradient.addColorStop(0.5, "#f76da5");
  gradient.addColorStop(1, "#dc3e82");

  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, rect.width, rect.height);

  scratchContext.textAlign = "center";
  scratchContext.textBaseline = "middle";

  scratchContext.font = "55px Arial";
  scratchContext.fillText("💗", rect.width / 2, rect.height * 0.33);

  scratchContext.fillStyle = "white";
  scratchContext.font = "bold 26px Arial";

  scratchContext.fillText(
    "Scratch Here",
    rect.width / 2,
    rect.height * 0.57
  );

  scratchContext.font = "15px Arial";

  scratchContext.fillText(
    "A surprise is hiding inside ✨",
    rect.width / 2,
    rect.height * 0.72
  );

  scratchDistance = 0;
}

function getScratchPoint(event) {
  const rect = scratchCanvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function eraseCircle(x, y) {
  scratchContext.globalCompositeOperation = "destination-out";
  scratchContext.beginPath();
  scratchContext.arc(x, y, 19, 0, Math.PI * 2);
  scratchContext.fill();
}

function completeScratch() {
  if (state.scratchCompleted) return;

  state.scratchCompleted = true;
  scratchDrawing = false;

  scratchCanvas.style.opacity = "0";
  scratchCanvas.style.pointerEvents = "none";

  $(".scratch-card")?.classList.add("scratch-revealed");

  const rect = scratchCanvas.getBoundingClientRect();

  heartBurst(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  );
}

/* ================= FLOWER GARDEN ================= */

function initializeGarden() {
  const garden = $("#flowerGarden");
  const message = $("#gardenMessage");

  if (!garden) return;

  const flowers = [
    "🌷", "🌸", "🌹", "🌺",
    "🌻", "🪷", "🌷", "🌸"
  ];

  let bloomed = 0;

  flowers.forEach((emoji, index) => {
    const button = document.createElement("button");

    button.className = "garden-flower";
    button.type = "button";
    button.textContent = emoji;

    button.setAttribute(
      "aria-label",
      `Bloom flower ${index + 1}`
    );

    button.addEventListener("click", () => {
      if (button.classList.contains("bloomed")) return;

      button.classList.add("bloomed");
      bloomed++;

      const rect = button.getBoundingClientRect();

      heartBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );

      if (bloomed === flowers.length && message) {
        message.textContent =
          "Every flower blooms for you, Sanu! 🌸❤️";
      }
    });

    garden.appendChild(button);
  });
}

/* ================= BIRTHDAY CAKE ================= */

function initializeCake() {
  const candle = $("#cakeCandle");
  const flame = $("#candleFlame");
  const message = $("#cakeWishMessage");

  if (!candle) return;

  candle.addEventListener("click", () => {
    if (state.candleBlown) return;

    state.candleBlown = true;
    flame?.classList.add("blown-out");

    if (message) {
      message.textContent =
        "May all your beautiful wishes come true, Sanu! 🎂❤️";
    }

    confetti();
  });
}

/* ================= GIFT ================= */

function initializeGift() {
  const button = $("#openGiftBtn");
  const message = $("#giftMessage");

  if (!button) return;

  button.addEventListener("click", () => {
    if (state.giftOpened) return;

    state.giftOpened = true;
    button.classList.add("opened");

    show(message);
    confetti();

    const rect = button.getBoundingClientRect();

    heartBurst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
  });
}

/* ================= CONFETTI ================= */

function confetti() {
  const container = $("#confettiContainer");

  if (!container) return;

  const colors = [
    "#ff4f91", "#ff9fc5", "#ffffff",
    "#ffd166", "#f55b9c"
  ];

  for (let i = 0; i < 85; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${random(0, 100)}vw`;
    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDuration = `${random(2.5, 5)}s`;
    piece.style.animationDelay = `${random(0, 0.5)}s`;

    container.appendChild(piece);

    setTimeout(() => piece.remove(), 6000);
  }
}

/* ================= FIREWORKS ================= */

function fireworks() {
  const canvas = $("#fireworksCanvas");

  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  canvas.width = rect.width;
  canvas.height = rect.height;

  const ctx = canvas.getContext("2d");
  const particles = [];

  const colors = [
    "#ff4f91", "#ffffff", "#ffd166", "#ff9fc5"
  ];

  function explode(x, y) {
    for (let i = 0; i < 65; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 5);

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  explode(canvas.width * 0.3, canvas.height * 0.35);
  explode(canvas.width * 0.7, canvas.height * 0.3);

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.life -= 0.01;

      ctx.globalAlpha = Math.max(0, particle.life);
      ctx.fillStyle = particle.color;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    frame++;

    if (frame % 45 === 0 && frame < 180) {
      explode(
        random(70, Math.max(71, canvas.width - 70)),
        random(50, Math.max(51, canvas.height * 0.6))
      );
    }

    if (frame < 250) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

/* ================= NIGHT SKY ================= */

function initializeSky() {
  window.addEventListener("resize", drawSkyStars);
}

function drawSkyStars() {
  const canvas = $("#starsCanvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  for (let i = 0; i < 120; i++) {
    ctx.fillStyle =
      `rgba(255,255,255,${random(0.25, 1)})`;

    ctx.beginPath();
    ctx.arc(
      random(0, rect.width),
      random(0, rect.height),
      random(0.5, 2.5),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

/* ================= SCROLL REVEAL ================= */

let revealObserver = null;

function initializeReveals() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach(element =>
      element.classList.add("visible")
    );
    return;
  }

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.08
  });

  $$(".reveal").forEach(element =>
    revealObserver.observe(element)
  );
}

function refreshReveals() {
  if (!revealObserver) return;

  $$(".reveal:not(.visible)").forEach(element =>
    revealObserver.observe(element)
  );
}

/* ================= DOWNLOAD CARD ================= */

function initializeDownload() {
  bindClick("#downloadCardBtn", downloadCard);
}

function downloadCard() {
  const canvas = document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 1500;

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(
    0, 0, 1200, 1500
  );

  gradient.addColorStop(0, "#fff1f6");
  gradient.addColorStop(1, "#ff9fc5");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 1500);

  ctx.strokeStyle = "#d83f83";
  ctx.lineWidth = 8;
  ctx.strokeRect(65, 65, 1070, 1370);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e83e83";

  ctx.font = "90px serif";
  ctx.fillText("💗", 600, 300);

  ctx.font = "bold 72px Georgia";
  ctx.fillText("Happy Birthday", 600, 450);

  ctx.font = "bold 68px Georgia";
  ctx.fillText("Sulochana Raut", 600, 570);

  ctx.fillStyle = "#85435e";
  ctx.font = "36px Georgia";

  const lines = [
    "To my beautiful Sanu,",
    "",
    "May your smile always shine",
    "as brightly as the stars.",
    "",
    "Thank you for being",
    "my favourite person.",
    "",
    "You are my little forever."
  ];

  let y = 730;

  lines.forEach(line => {
    ctx.fillText(line, 600, y);
    y += 65;
  });

  ctx.fillStyle = "#d83f83";
  ctx.font = "bold 48px Georgia";
  ctx.fillText("With Love, Ankit", 600, 1370);

  const link = document.createElement("a");

  link.download = "Happy-Birthday-Sulochana.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ================= REPLAY ================= */

function initializeReplay() {
  bindClick("#replayBtn", () => {
    window.location.reload();
  });
}

/* ================= INITIALIZE WEBSITE ================= */

function initializeWebsite() {
  // Music is initialized first.
  initializeMusic();

  initializeWelcome();
  initializeHearts();

  initializeCalendar();
  initializeNickname();
  initializeBirthday();

  initializeAlbum();
  initializePhotoModal();
  initializeMovie();

  initializeLetter();
  initializeReasons();
  initializeLoveJar();

  initializeScratch();
  initializeGarden();
  initializeCake();
  initializeGift();

  initializeSky();
  initializeReveals();

  initializeDownload();
  initializeReplay();

  changePage("welcome");

  /*
    Retry audible playback after a user gesture
    if the browser blocked autoplay.
  */

  function retryMusicAfterInteraction() {
    if (!music || state.musicManuallyPaused) return;

    if (music.paused) {
      playMusic();
    }
  }

  document.addEventListener(
    "pointerdown",
    retryMusicAfterInteraction
  );

  document.addEventListener(
    "keydown",
    retryMusicAfterInteraction
  );

  console.log("❤️ Website initialized.");
  console.log("📸 21 photos configured for lazy loading.");
  console.log("🎵 Background music loops automatically.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
  initializeWebsite();
}