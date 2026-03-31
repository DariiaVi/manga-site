const API = "https://manga-site-er5s.onrender.com";

const params = new URLSearchParams(window.location.search);
const mangaId = params.get("id");

/* ======================
LOAD MANGA
====================== */

async function loadManga() {
  try {
    const res = await fetch(`${API}/mangas`);
    const mangas = await res.json();

    const manga = mangas.find((m) => String(m._id) === String(mangaId));
    if (!manga) {
      document.body.innerHTML = "<h2>Манга не найдена</h2>";
      return;
    }

    document.getElementById("pageTitle").textContent = manga.title;

    document.getElementById("mangaCover").src = `${API}` + manga.cover;

    document.getElementById("mangaTitle").textContent = manga.title;

    document.getElementById("mangaType").textContent = "Тип: " + manga.type;

    document.getElementById("mangaGenres").textContent =
      "Жанры: " + manga.genres;

    document.getElementById("mangaDescription").textContent = manga.description;

    const startBtn = document.getElementById("startReadBtn");

    if (startBtn) {
      startBtn.addEventListener("click", async () => {
        const res = await fetch(`${API}/chapters/${mangaId}`);
        const chapters = await res.json();

        if (chapters.length > 0) {
          const firstChapter = chapters[0]._id;

          window.location.href = `reader.html?chapter=${firstChapter}`;
        }
      });
    }
  } catch (error) {
    console.error("Ошибка загрузки манги:", error);
  }
}

/* ======================
LOAD CHAPTERS
====================== */

async function loadChapters() {
  try {
    const res = await fetch(`${API}/chapters/${mangaId}`);
    const chapters = await res.json();

    const chapterList = document.getElementById("chapterList");
    chapterList.innerHTML = "";

    chapters.forEach((chapter) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="reader.html?chapter=${chapter._id}">
          Глава ${chapter.number} — ${chapter.title}
        </a>
      `;

      chapterList.appendChild(li);
    });
  } catch (error) {
    console.error("Ошибка загрузки глав:", error);
  }
}

/* ======================
FAVORITES
====================== */

const favBtn = document.getElementById("favBtn");

if (favBtn) {
  favBtn.onclick = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Нужно войти");
      return;
    }
    console.log("fav id:", mangaId);
    await fetch(`${API}/favorites/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        mangaId,
      }),
    });

    alert("Добавлено в избранное");
  };
}

/* ======================
ADD TO COLLECTION
====================== */

window.addToCollection = async function (id = mangaId) {
  const username = localStorage.getItem("username");

  if (!username) {
    alert("Сначала войдите в аккаунт");
    return;
  }

  const collectionName = prompt("Введите название коллекции");

  if (!collectionName) return;

  console.log("Добавляем:", id);

  await fetch(`${API}/collections/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      collectionName,
      mangaId: id,
    }),
  });

  alert("Манга добавлена в коллекцию");
};

/* ======================
READING LIST
====================== */

async function addToReading(status) {
  const username = localStorage.getItem("username");

  if (!username) {
    alert("Нужно войти");
    return;
  }

  await fetch(`${API}/reading/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      mangaId,
      status,
    }),
  });

  alert("Манга добавлена в мой список");
}

/* ======================
START
====================== */

loadManga();
loadChapters();
