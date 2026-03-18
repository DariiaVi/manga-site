document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const container = document.getElementById("favoritesContainer");

  if (!username) {
    container.innerHTML = "<p>Сначала войдите в аккаунт</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/favorites/${username}`);
    const favIds = await res.json();

    const mangasRes = await fetch("http://localhost:3000/mangas");
    const mangas = await mangasRes.json();

    const favorites = mangas.filter((m) => favIds.includes(m._id));

    container.innerHTML = "";

    favorites.forEach((manga) => {
      const card = document.createElement("div");
      card.className = "manga-card";

      card.innerHTML = `
        <img src="http://localhost:3000${manga.cover}" />

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
    console.error(err);
    container.innerHTML = "<p>Ошибка загрузки избранного</p>";
  }
});
