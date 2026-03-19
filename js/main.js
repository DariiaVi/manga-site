console.log("MAIN VERSION FINAL FIXED");
document.addEventListener("click", () => {
  console.log("ANY CLICK 🔥");
});
document.addEventListener("DOMContentLoaded", () => {
  /* ===== USER ===== */

  const params = new URLSearchParams(window.location.search);
  const userFromURL = params.get("user");

  if (userFromURL) {
    localStorage.setItem("username", userFromURL);

    // 💥 убираем ?user= из URL (чтобы не логинило заново после logout)
    window.history.replaceState({}, document.title, "/");
  }

  const username = localStorage.getItem("username");

  /* ===== ФИЛЬТРЫ ===== */

  const genreFilters = document.querySelectorAll(".genre-filter");

  genreFilters.forEach((filter) => {
    filter.addEventListener("change", applyFilters);
  });

  function applyFilters() {
    const selectedGenres = [...genreFilters]
      .filter((g) => g.checked)
      .map((g) => g.value.toLowerCase());

    document.querySelectorAll(".manga-card").forEach((card) => {
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

        const randomManga = mangas[Math.floor(Math.random() * mangas.length)];

        window.location.href = `manga.html?id=${randomManga._id}`;
      } catch (error) {
        console.error("Random manga error:", error);
      }
    });
  }

  /* ===== АВТОЛОГИН ===== */

  const authBlock = document.querySelector(".auth");
  const profileLinkAside = document.getElementById("profileLinkAside");

  const usernameInput = document.getElementById("usernameInput");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtnMain");

  if (username && authBlock) {
    if (usernameInput) usernameInput.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";

    const authControls = document.getElementById("authControls");
    const userBox = document.getElementById("userBox");

    if (username && authBlock) {
      // ❌ скрываем кнопки входа
      if (authControls) authControls.style.display = "none";

      // ✅ вставляем пользователя в уже существующий блок
      if (userBox) {
        userBox.innerHTML = `
      <span class="user-name">Привет, ${username} 💜</span>
      <button id="logoutBtn">Выйти</button>
    `;
      }

      if (profileLinkAside) profileLinkAside.style.display = "block";
    } else {
      // ✅ показываем кнопки входа обратно
      if (authControls) authControls.style.display = "block";

      if (userBox) userBox.innerHTML = "";

      if (profileLinkAside) profileLinkAside.style.display = "none";
    }
    if (profileLinkAside) profileLinkAside.style.display = "block";
  } else {
    if (profileLinkAside) profileLinkAside.style.display = "none";
  }

  /* ===== КНОПКИ ВХОДА ===== */

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "https://lamp-login-dl7a.vercel.app";
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.href = "https://lamp-login-dl7a.vercel.app";
    });
  }

  /* ===== ПОИСК ===== */

  const searchInput = document.getElementById("mainSearch");
  const searchBtn = document.getElementById("searchBtn");

  function runSearch() {
    const search = searchInput.value.toLowerCase();

    document.querySelectorAll(".manga-card").forEach((card) => {
      const title = card.querySelector("h4").textContent.toLowerCase();
      card.style.display = title.includes(search) ? "" : "none";
    });
  }

  if (searchBtn) searchBtn.addEventListener("click", runSearch);

  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") runSearch();
    });
  }

  /* ===== СБРОС ===== */

  const resetBtn = document.getElementById("resetFilters");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document
        .querySelectorAll('.filters input[type="checkbox"]')
        .forEach((cb) => (cb.checked = false));

      if (searchInput) searchInput.value = "";

      document.querySelectorAll(".manga-card").forEach((card) => {
        card.style.display = "";
      });
    });
  }

  const resetTypeBtn = document.getElementById("resetTypeFilters");

  if (resetTypeBtn) {
    resetTypeBtn.addEventListener("click", () => {
      document
        .querySelectorAll('.filters input[type="checkbox"]')
        .forEach((cb) => (cb.checked = false));

      document.querySelectorAll(".manga-card").forEach((card) => {
        card.style.display = "";
      });
    });
  }

  /* ===== CONTINUE ===== */

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

/* ===== DEBUG ===== */

const user = localStorage.getItem("username");

if (user) {
  console.log("Ты вошла как:", user);
}
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "logoutBtn") {
    console.log("LOGOUT CLICKED ✅");

    localStorage.removeItem("username");

    window.location.href = "/";
  }
});
