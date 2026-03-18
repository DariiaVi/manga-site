console.log("MAIN VERSION NEW");
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const userFromURL = params.get("user");

  if (userFromURL) {
    localStorage.setItem("username", userFromURL);
  }
  const username = localStorage.getItem("username");
  const genreFilters = document.querySelectorAll(".genre-filter");

  genreFilters.forEach((filter) => {
    filter.addEventListener("change", applyFilters);
  });

  function applyFilters() {
    const selectedGenres = [...genreFilters]
      .filter((g) => g.checked)
      .map((g) => g.value.toLowerCase());

    const cards = document.querySelectorAll(".manga-card");

    cards.forEach((card) => {
      const genres = card.querySelector(".genres").textContent.toLowerCase();

      const match =
        selectedGenres.length === 0 ||
        selectedGenres.every((g) => genres.includes(g));

      card.style.display = match ? "" : "none";
    });
  }

  /* ===== RANDOM MANGA ===== */

  const randomBtn = document.getElementById("randomMangaBtn");

  if (randomBtn) {
    randomBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("https://manga-site-er5s.onrender.com/mangas");
        const mangas = await res.json();

        if (!mangas.length) return;

        const randomIndex = Math.floor(Math.random() * mangas.length);
        const randomManga = mangas[randomIndex];

        window.location.href = `manga.html?id=${randomManga._id}`;
      } catch (error) {
        console.error("Random manga error:", error);
      }
    });
  }

  /* ===== ШАПКА / АВТОЛОГИН ===== */

  const authBlock = document.querySelector(".auth");
  const profileLinkAside = document.getElementById("profileLinkAside");

  if (username && authBlock) {
    authBlock.innerHTML = `
      <span class="user-name">Привет, ${username} 💜</span>
      <button id="logoutBtn">Выйти</button>
    `;

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("username");
      window.location.reload();
    });

    if (profileLinkAside) {
      profileLinkAside.style.display = "block";
    }
  } else {
    if (profileLinkAside) {
      profileLinkAside.style.display = "none";
    }
  }

  /* ===== НАВИГАЦИЯ ===== */

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtnMain");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  /* ===== ПОИСК ===== */

  const searchInput = document.getElementById("mainSearch");
  const searchBtn = document.getElementById("searchBtn");

  function runSearch() {
    const search = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".manga-card");

    cards.forEach((card) => {
      const title = card.querySelector("h4").textContent.toLowerCase();

      card.style.display = title.includes(search) ? "" : "none";
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", runSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") runSearch();
    });
  }

  /* ===== СБРОС ФИЛЬТРОВ ===== */

  const resetBtn = document.getElementById("resetFilters");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document
        .querySelectorAll('.filters input[type="checkbox"]')
        .forEach((cb) => (cb.checked = false));

      if (searchInput) searchInput.value = "";

      const cards = document.querySelectorAll(".manga-card");

      cards.forEach((card) => {
        card.style.display = "";
      });
    });
  }

  /* ===== СБРОС ТИПА ===== */

  const resetTypeBtn = document.getElementById("resetTypeFilters");

  if (resetTypeBtn) {
    resetTypeBtn.addEventListener("click", () => {
      document
        .querySelectorAll('.filters input[type="checkbox"]')
        .forEach((cb) => (cb.checked = false));

      const cards = document.querySelectorAll(".manga-card");

      cards.forEach((card) => {
        card.style.display = "";
      });
    });
  }

  /* ===== HERO КНОПКИ ===== */

  const heroRead = document.getElementById("heroRead");

  if (heroRead) {
    heroRead.addEventListener("click", async () => {
      const mangaId = "69aa909613e31010a5f1a317";

      const res = await fetch(
        `https://manga-site-er5s.onrender.com/chapters/${mangaId}`,
      );
      const chapters = await res.json();

      if (chapters.length > 0) {
        const firstChapter = chapters[0]._id;

        window.location.href = `reader.html?chapter=${firstChapter}`;
      }
    });
  }

  const heroInfo = document.getElementById("heroInfo");

  if (heroInfo) {
    heroInfo.addEventListener("click", () => {
      window.location.href = "manga.html?id=69aa909613e31010a5f1a317";
    });
  }

  /* ===== CONTINUE READING ===== */

  const continueBtn = document.getElementById("continueReadingBtn");

  if (continueBtn) {
    const lastChapter = localStorage.getItem("lastChapter");

    if (lastChapter) {
      continueBtn.style.display = "block";

      continueBtn.addEventListener("click", () => {
        window.location.href = `reader.html?chapter=${lastChapter}`;
      });
    } else {
      continueBtn.style.display = "none";
    }
  }
});
