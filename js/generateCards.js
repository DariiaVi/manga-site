document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("mangaContainer");
  const searchInput = document.getElementById("searchInput");

  try {
    const res = await fetch("http://localhost:3000/mangas");
    window.mangas = await res.json();

    window.mangas.forEach((manga) => {
      const card = document.createElement("div");
      card.className = "manga-card";

      card.dataset.type = manga.type.toLowerCase();

      card.innerHTML = `
        <img src="http://localhost:3000${manga.cover}" alt="${manga.title}" />

        <div class="card-info">
          <h4>${manga.title}</h4>

          <span class="type">
            ${manga.type}
          </span>

          <p class="genres">${manga.genres}</p>

          <button class="read-btn"
            onclick="location.href='manga.html?id=${manga._id}'">
            Читать
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Ошибка загрузки манги:", err);
  }

  /* ===== ПОИСК ===== */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const search = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll(".manga-card");

      cards.forEach((card) => {
        const title = card.querySelector("h4").textContent.toLowerCase();

        card.style.display = title.includes(search) ? "" : "none";
      });
    });
  }
});
