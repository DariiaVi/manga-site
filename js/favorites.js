document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const container = document.getElementById("favoritesContainer");

  if (!username) {
    container.innerHTML = "<p>Сначала войдите в аккаунт</p>";
    return;
  }

  try {
    // 🔥 получаем избранное пользователя
    const res = await fetch(
      `https://manga-site-er5s.onrender.com/favorites/${username}`,
    );

    const favData = await res.json();

    console.log("favData:", favData);

    // 🔥 нормализуем id (чтобы точно совпадали)
    const favoriteIds = favData
      .map((item) => {
        if (typeof item === "string") return item;
        if (item.mangaId) return item.mangaId;
        if (item._id) return item._id;
        return null;
      })
      .filter(Boolean);

    // 🔥 получаем все манги
    const mangasRes = await fetch(
      "https://manga-site-er5s.onrender.com/mangas",
    );

    const mangas = await mangasRes.json();

    // 🔥 сравниваем корректно
    const favorites = mangas.filter((m) =>
      favoriteIds.includes(m._id.toString()),
    );

    container.innerHTML = "";

    // ❗ если пусто
    if (favorites.length === 0) {
      container.innerHTML = "<p>У тебя пока нет избранного 💔</p>";
      return;
    }

    // 🔥 рендер
    favorites.forEach((manga) => {
      const card = document.createElement("div");
      card.className = "manga-card";

      card.innerHTML = `
        <img src="https://manga-site-er5s.onrender.com${manga.cover}" />

        <div class="card-info">
          <h4>${manga.title}</h4>
          <span>${manga.type}</span>

          <button onclick="location.href='manga.html?id=${manga._id}'">
            Читать
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Ошибка:", err);
    container.innerHTML = "<p>Ошибка загрузки избранного</p>";
  }
});
