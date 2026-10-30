
/* ==========================================================
   OUR LITTLE FOREVER 💗
   COMPLETE JAVASCRIPT — MOBILE PHOTO LOADING FIX

   Made by Ankit for Sulochana Raut
   ========================================================== */

"use strict";

/* ==========================================================
   1. CONFIGURATION
   ========================================================== */

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
  video: "assets/music/your-video.mp4",
  musicVolume: 0.5
};

/* ==========================================================
   2. HELPERS
   ========================================================== */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const random = (min, max) =>
  Math.random() * (max - min) + min;

function show(element) {
  if (element) element.classList.remove("hidden");
}

function hide(element) {
  if (element) element.classList.add("hidden");
}

/* ==========================================================
   3. WEBSITE STATE
   ========================================================== */

const state = {
  photos: [],
  albumIndex: 0,
  albumOpened: false,
  nicknameAnswered: false,
  scratchReady: false,
  scratchCompleted: false,
  candleBlown: false,
  giftOpened: false,
  musicPlaying: false,
  musicManuallyPaused: false
};

/* ==========================================================
   4. PAGE NAVIGATION
   ========================================================== */

const pages = {
  welcome: $("#welcomePage"),
  calendar: $("#calendarPage"),
  nickname: $("#nicknamePage"),
  birthday: $("#birthdayPage"),
  main: $("#mainWebsite")
};

function changePage(name) {
  Object.entries(pages).forEach(([key, element]) => {
    if (key === name) show(element);
    else hide(element);
  });

  window.scrollTo(0, 0);

  if (name === "main") {
    show($("#musicPlayer"));

    setTimeout(() => {
      initializeScratchSurface();
      refreshReveals();
      drawSkyStars();
    }, 200);
  }
}

/* ==========================================================
   5. BACKGROUND MUSIC 🎵
   ========================================================== */

let music = null;

function initializeMusic() {
  music = $("#backgroundMusic");

  const toggle = $("#musicToggle");
  const volume = $("#volumeControl");
  const player = $("#musicPlayer");

  if (!music) {
    console.error("Background music element not found!");
    return;
  }

  const audioSource = music.querySelector("source");

  if (audioSource) audioSource.src = CONFIG.music;
  else music.src = CONFIG.music;

  music.loop = true;
  music.preload = "auto";
  music.volume = CONFIG.musicVolume;

  if (player) show(player);

  if (volume) {
    volume.value = CONFIG.musicVolume;

    volume.addEventListener("input", () => {
      music.volume = Number(volume.value);
    });
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (music.paused) {
        state.musicManuallyPaused = false;
        playMusic();
      } else {
        pauseMusic();
      }
    });
  }

  music.addEventListener("play", () => {
    state.musicPlaying = true;
    updateMusicButton();
  });

  music.addEventListener("pause", () => {
    state.musicPlaying = false;
    updateMusicButton();
  });

  music.addEventListener("ended", () => {
    if (state.musicManuallyPaused) return;

    music.currentTime = 0;
    playMusic();
  });

  music.addEventListener("error", () => {
    console.error("Music could not be loaded:", CONFIG.music);
  });

  music.load();
  playMusic();

  console.log("🎵 Background music initialized.");
}

async function playMusic() {
  if (!music || state.musicManuallyPaused) return false;

  if (!music.paused) {
    state.musicPlaying = true;
    updateMusicButton();
    return true;
  }

  try {
    await music.play();

    state.musicPlaying = true;
    updateMusicButton();

    return true;
  } catch (error) {
    state.musicPlaying = false;
    updateMusicButton();

    console.log("🎵 Autoplay unavailable. Music will retry after interaction.");

    return false;
  }
}

function pauseMusic() {
  if (!music) return;

  state.musicManuallyPaused = true;
  music.pause();
  state.musicPlaying = false;

  updateMusicButton();
}

function updateMusicButton() {
  const toggle = $("#musicToggle");
  if (!toggle) return;

  if (state.musicPlaying) {
    toggle.textContent = "⏸";
    toggle.classList.add("playing");
    toggle.setAttribute("aria-label", "Pause background music");
  } else {
    toggle.textContent = "🎵";
    toggle.classList.remove("playing");
    toggle.setAttribute("aria-label", "Play background music");
  }
}

/* ==========================================================
   6. WELCOME SCREEN 💗
   ========================================================== */

function initializeWelcome() {
  const beginButton = $("#beginSurpriseBtn");

  if (beginButton) {
    beginButton.addEventListener("click", () => {
      playMusic();

      heartBurst(
        window.innerWidth / 2,
        window.innerHeight / 2
      );

      setTimeout(() => changePage("calendar"), 350);
    });
  }

  const typingElement = $("#welcomeTypingText");
  if (!typingElement) return;

  const text =
    "Some surprises are made with love... and this one is only for you, Sanu. 💗";

  typingElement.textContent = "";

  let index = 0;

  function type() {
    if (index >= text.length) return;

    typingElement.textContent += text[index];
    index++;

    setTimeout(type, 45);
  }

  setTimeout(type, 500);
}

/* ==========================================================
   7. FLOATING HEARTS
   ========================================================== */

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
  }, 900);
}

/* ==========================================================
   8. HEART BURST
   ========================================================== */

function heartBurst(x, y) {
  const emojis = ["💗", "💕", "✨", "🌸"];

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");

    heart.textContent =
      emojis[Math.floor(Math.random() * emojis.length)];

    heart.className = "burst-heart";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    const angle = random(0, Math.PI * 2);
    const distance = random(60, 220);

    heart.animate(
      [
        {
          transform: "translate(-50%,-50%) scale(.5)",
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

/* ==========================================================
   9. NEPALI BIRTHDAY CALENDAR 📅
   ========================================================== */

function initializeCalendar() {
  const yearSelect = $("#bsYear");
  const monthSelect = $("#bsMonth");
  const daysContainer = $("#calendarDays");
  const selectedText = $("#selectedDateText");
  const feedback = $("#calendarFeedback");
  const unlockButton = $("#unlockBtn");

  if (!yearSelect || !monthSelect || !daysContainer || !unlockButton) {
    return;
  }

  let selectedDay = null;

  for (let year = 2055; year <= 2075; year++) {
    const option = document.createElement("option");

    option.value = year;
    option.textContent = `${year} BS`;

    yearSelect.appendChild(option);
  }

  function renderDays() {
    daysContainer.innerHTML = "";
    selectedDay = null;

    for (let day = 1; day <= 32; day++) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "calendar-day";
      button.textContent = day;

      button.addEventListener("click", () => {
        $$(".calendar-day", daysContainer).forEach(item => {
          item.classList.remove("selected");
        });

        button.classList.add("selected");
        selectedDay = day;

        updateSelectedText();

        if (feedback) feedback.textContent = "";
      });

      daysContainer.appendChild(button);
    }
  }

  function updateSelectedText() {
    if (!selectedText) return;

    if (!selectedDay) {
      selectedText.textContent = "Select your special date 💗";
      return;
    }

    const monthName =
      monthSelect.options[monthSelect.selectedIndex]?.textContent || "Month";

    selectedText.textContent =
      `${yearSelect.value || "Year"} / ${monthName} / ${selectedDay}`;
  }

  yearSelect.addEventListener("change", updateSelectedText);

  monthSelect.addEventListener("change", () => {
    renderDays();
    updateSelectedText();
  });

  renderDays();

  unlockButton.addEventListener("click", () => {
    playMusic();

    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);

    const correct =
      year === CONFIG.birthday.year &&
      month === CONFIG.birthday.month &&
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

/* ==========================================================
   10. NICKNAME QUESTION 🥹
   ========================================================== */

function initializeNickname() {
  const buttons = $$(".nickname-btn");
  const result = $("#nicknameResult");
  const enterButton = $("#enterHeartBtn");

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

  if (enterButton) {
    enterButton.addEventListener("click", () => {
      playMusic();
      changePage("birthday");
      confetti();
      fireworks();
    });
  }
}

/* ==========================================================
   11. GRAND BIRTHDAY REVEAL 🎂
   ========================================================== */

function initializeBirthday() {
  const exploreButton = $("#exploreWorldBtn");
  if (!exploreButton) return;

  exploreButton.addEventListener("click", () => {
    playMusic();
    changePage("main");

    setTimeout(confetti, 300);
  });
}

/* ==========================================================
   12. PHOTO LOADING 📸 — MOBILE FIX
   ========================================================== */

/*
  IMPORTANT:
  Do not wait for all 21 images before displaying the album.

  All photo paths are added immediately.
  Images load when the album pages are displayed.
  If an image is missing, only that image is removed.
*/

function loadPhotos() {
  state.photos = Array.from(
    { length: CONFIG.photoCount },
    (_, index) => `${CONFIG.photoFolder}photo${index + 1}.jpg`
  );

  state.albumIndex = 0;

  renderAlbum();

  console.log(`📸 ${state.photos.length} photo paths added.`);
}

/* ==========================================================
   13. PHOTO CAPTIONS
   ========================================================== */

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

/* ==========================================================
   14. PHOTO ALBUM
   ========================================================== */

function getAlbumStep() {
  return window.innerWidth <= 650 ? 1 : 2;
}

function renderAlbum() {
  const container = $("#albumPages");
  const pageNumber = $("#albumPageNumber");

  if (!container) return;

  container.innerHTML = "";

  if (!state.photos.length) {
    container.innerHTML = `
      <div class="album-empty">
        <h3>Our memories are waiting 💗</h3>
        <p>
          Add photo1.jpg through photo21.jpg
          inside assets/photos/
        </p>
      </div>
    `;

    if (pageNumber) pageNumber.textContent = "No photos";
    return;
  }

  const step = getAlbumStep();

  const currentPage = Math.floor(state.albumIndex / step) + 1;
  const totalPages = Math.ceil(state.photos.length / step);

  for (let offset = 0; offset < step; offset++) {
    const index = state.albumIndex + offset;

    if (index >= state.photos.length) {
      if (step === 2 && offset === 1) {
        const endingPage = document.createElement("div");

        endingPage.className = "album-page album-ending-page";
        endingPage.style.textAlign = "center";
        endingPage.style.justifyContent = "center";

        endingPage.innerHTML = `
          <div style="padding: 30px 15px; text-align: center;">
            <div style="font-size: 60px; margin-bottom: 20px;">
              💗
            </div>

            <h3 style="
              color: #e83e83;
              font-size: clamp(28px, 4vw, 44px);
              margin-bottom: 20px;
            ">
              Ankit & Sulochana
            </h3>

            <p style="
              color: #9b6a80;
              font-size: 17px;
              line-height: 2;
            ">
              Our memories don't end here.
              The most beautiful chapters
              are still waiting to be written.
            </p>

            <p style="
              font-family: 'Great Vibes', cursive;
              color: #e83e83;
              font-size: 38px;
              margin-top: 30px;
            ">
              Forever Yours, Ankit ❤️
            </p>
          </div>
        `;

        container.appendChild(endingPage);
      }

      break;
    }

    const photoPath = state.photos[index];

    const page = document.createElement("div");
    page.className = "album-page";

    const img = document.createElement("img");

    img.src = photoPath;
    img.alt = `Sulochana memory ${index + 1}`;

    // Load the currently displayed album images immediately.
   img.loading = "eager";
   img.decoding = "async";
   img.fetchPriority = "high";
    /*
      If a photo cannot load, remove only that photo.
      The other 20 photos will remain available.
    */

    img.onerror = () => {
      const failedIndex = state.photos.indexOf(photoPath);

      if (failedIndex === -1) return;

      state.photos.splice(failedIndex, 1);

      if (state.albumIndex >= state.photos.length) {
        state.albumIndex = Math.max(
          0,
          Math.floor((state.photos.length - 1) / getAlbumStep()) *
            getAlbumStep()
        );
      }

      console.warn("Photo could not be loaded:", photoPath);

      renderAlbum();
    };

    const caption = document.createElement("p");

    caption.className = "album-caption";
    caption.textContent = captions[index % captions.length];

    img.addEventListener("click", () => {
      const currentIndex = state.photos.indexOf(photoPath);

      if (currentIndex !== -1) openPhotoModal(currentIndex);
    });

    page.appendChild(img);
    page.appendChild(caption);

    container.appendChild(page);
  }

  if (pageNumber) {
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
  }
}

/* ==========================================================
   15. ALBUM CONTROLS
   ========================================================== */

function initializeAlbum() {
  const cover = $("#albumCover");
  const book = $("#albumBook");

  const openButton = $("#openAlbumBtn");
  const nextButton = $("#nextPageBtn");
  const previousButton = $("#prevPageBtn");

  if (openButton) {
    openButton.addEventListener("click", () => {
      hide(cover);
      show(book);

      state.albumOpened = true;
      state.albumIndex = 0;

      renderAlbum();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!state.photos.length) return;

      const step = getAlbumStep();

      state.albumIndex += step;

      if (state.albumIndex >= state.photos.length) {
        state.albumIndex = 0;
      }

      renderAlbum();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      if (!state.photos.length) return;

      const step = getAlbumStep();

      state.albumIndex -= step;

      if (state.albumIndex < 0) {
        state.albumIndex =
          Math.floor((state.photos.length - 1) / step) * step;
      }

      renderAlbum();
    });
  }

  const albumPages = $("#albumPages");

  if (albumPages) {
    let startX = 0;

    albumPages.addEventListener("touchstart", event => {
      startX = event.changedTouches[0].screenX;
    }, { passive: true });

    albumPages.addEventListener("touchend", event => {
      const endX = event.changedTouches[0].screenX;

      if (Math.abs(startX - endX) < 50) return;

      if (startX > endX) nextButton?.click();
      else previousButton?.click();
    }, { passive: true });
  }

  window.addEventListener("resize", () => {
    const step = getAlbumStep();

    state.albumIndex =
      Math.floor(state.albumIndex / step) * step;

    renderAlbum();
  });
}

/* ==========================================================
   16. PHOTO MODAL
   ========================================================== */

function openPhotoModal(index) {
  const modal = $("#photoModal");
  if (!modal) return;

  const image = $("#modalPhoto");
  const caption = $("#modalCaption");

  if (image) image.src = state.photos[index];

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
  const closeButton = $("#closePhotoModal");
  const modal = $("#photoModal");

  closeButton?.addEventListener("click", closePhotoModal);

  modal?.addEventListener("click", event => {
    if (event.target === modal) closePhotoModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePhotoModal();
  });
}

/* ==========================================================
   17. A LITTLE MOVIE ABOUT YOU 🎬
   ========================================================== */

function initializeMovie() {
  const video = $("#loveVideo");

  if (!video) {
    console.warn("Love video element not found.");
    return;
  }

  video.src = CONFIG.video;
  video.preload = "metadata";
  video.load();

  video.addEventListener("loadedmetadata", () => {
    console.log("🎬 Love video loaded successfully.");
  });

  video.addEventListener("error", () => {
    console.error(
      "Video could not be loaded. Check the filename and path:",
      CONFIG.video
    );
  });
}

/* ==========================================================
   18. LOVE LETTER 💌
   ========================================================== */

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

/* ==========================================================
   19. TWENTY LOVE REASONS
   ========================================================== */

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

        <span class="reason-back">
          ${reason}
        </span>
      </span>
    `;

    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    grid.appendChild(card);
  });
}

/* ==========================================================
   20. JAR OF LOVE
   ========================================================== */

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

/* ==========================================================
   21. SCRATCH PHOTO 🎀
   ========================================================== */

let scratchCanvas = null;
let scratchContext = null;
let scratchDrawing = false;
let scratchPrevious = null;
let scratchDistance = 0;

function initializeScratch() {
  scratchCanvas = $("#scratchCanvas");
  if (!scratchCanvas) return;

  const card = $(".scratch-card");
  const message = $(".scratch-message");

  if (!card || !message) return;

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
        <p>I Love You, Sulochana! ❤️</p>
      </div>
    </div>
  `;

  const image = $(".scratch-secret-photo");

  image.onerror = () => {
    console.warn("scratch.jpg photo not found.");

    image.style.display = "none";

    const reveal = $(".scratch-photo-reveal");

    if (reveal) {
      reveal.style.background =
        "linear-gradient(135deg,#ffc4dc,#ff82b1)";
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        initializeScratchSurface();

        if (state.scratchReady) observer.disconnect();
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
    } catch (error) {}

    eraseCircle(scratchPrevious.x, scratchPrevious.y);
  });

  scratchCanvas.addEventListener("pointermove", event => {
    if (
      !scratchDrawing ||
      state.scratchCompleted ||
      !scratchContext
    ) return;

    event.preventDefault();

    const point = getScratchPoint(event);

    scratchContext.globalCompositeOperation = "destination-out";

    scratchContext.lineWidth = 38;
    scratchContext.lineCap = "round";
    scratchContext.lineJoin = "round";

    scratchContext.beginPath();

    scratchContext.moveTo(
      scratchPrevious.x,
      scratchPrevious.y
    );

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

  const stopDrawing = () => {
    scratchDrawing = false;
    scratchPrevious = null;
  };

  scratchCanvas.addEventListener("pointerup", stopDrawing);
  scratchCanvas.addEventListener("pointercancel", stopDrawing);

  window.addEventListener("resize", () => {
    if (!state.scratchCompleted && state.scratchReady) {
      paintScratch();
    }
  });
}

function initializeScratchSurface() {
  if (
    !scratchCanvas ||
    state.scratchReady ||
    state.scratchCompleted
  ) return;

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

  scratchContext.fillText(
    "💗",
    rect.width / 2,
    rect.height * 0.33
  );

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

/* ==========================================================
   22. FLOWER GARDEN 🌸
   ========================================================== */

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
          "Every flower blooms for you, Sulochana! 🌸❤️";
      }
    });

    garden.appendChild(button);
  });
}

/* ==========================================================
   23. BIRTHDAY CAKE 🎂
   ========================================================== */

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

/* ==========================================================
   24. GIFT SURPRISE 🎁
   ========================================================== */

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

/* ==========================================================
   25. CONFETTI 🎉
   ========================================================== */

function confetti() {
  const container = $("#confettiContainer");
  if (!container) return;

  const colors = [
    "#ff4f91",
    "#ff9fc5",
    "#ffffff",
    "#ffd166",
    "#f55b9c"
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

/* ==========================================================
   26. FIREWORKS 🎆
   ========================================================== */

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
    "#ff4f91",
    "#ffffff",
    "#ffd166",
    "#ff9fc5"
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

/* ==========================================================
   27. NIGHT SKY 🌌
   ========================================================== */

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
    ctx.fillStyle = `rgba(255,255,255,${random(0.25, 1)})`;

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

/* ==========================================================
   28. SCROLL REVEAL
   ========================================================== */

let revealObserver = null;

function initializeReveals() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach(element => {
      element.classList.add("visible");
    });

    return;
  }

  revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08
    }
  );

  $$(".reveal").forEach(element => {
    revealObserver.observe(element);
  });
}

function refreshReveals() {
  if (!revealObserver) return;

  $$(".reveal:not(.visible)").forEach(element => {
    revealObserver.observe(element);
  });
}

/* ==========================================================
   29. DOWNLOAD BIRTHDAY CARD 💌
   ========================================================== */

function initializeDownload() {
  const button = $("#downloadCardBtn");
  if (!button) return;

  button.addEventListener("click", downloadCard);
}

function downloadCard() {
  const canvas = document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 1500;

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 1200, 1500);

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

/* ==========================================================
   30. REPLAY SURPRISE
   ========================================================== */

function initializeReplay() {
  const button = $("#replayBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    window.location.reload();
  });
}

/* ==========================================================
   31. INITIALIZE WEBSITE
   ========================================================== */

function initializeWebsite() {
  console.log("💗 Our Little Forever — Ankit & Sulochana");

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

  // Photos are registered immediately.
  // No waiting for all 21 image requests.
  loadPhotos();

  function retryMusicAfterInteraction() {
    if (!music || state.musicManuallyPaused) return;

    if (!music.paused) {
      document.removeEventListener(
        "pointerdown",
        retryMusicAfterInteraction
      );

      document.removeEventListener(
        "keydown",
        retryMusicAfterInteraction
      );

      return;
    }

    playMusic();
  }

  document.addEventListener(
    "pointerdown",
    retryMusicAfterInteraction
  );

  document.addEventListener(
    "keydown",
    retryMusicAfterInteraction
  );

  console.log("🎵 Music will loop automatically.");
  console.log("📸 Album configured for 21 photos.");
  console.log("🎬 Personal love video configured.");
  console.log("❤️ Website initialized successfully!");
}

/* ==========================================================
   32. DOM READY
   ========================================================== */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeWebsite
  );
} else {
  initializeWebsite();
}

/* ==========================================================
   END OF JAVASCRIPT
   ANKIT ❤️ SULOCHANA
   ========================================================== */
