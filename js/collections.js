const container = document.getElementById("collectionsContainer");
const createBtn = document.getElementById("createCollectionBtn");
const input = document.getElementById("collectionName");

/* ===== ЗАГРУЗКА КОЛЛЕКЦИЙ ===== */

async function loadCollections() {
  const username = localStorage.getItem("username");

  if (!username) {
    container.innerHTML = "<p>Сначала войдите в аккаунт</p>";
    return;
  }

  try {
    // 🔥 получаем коллекции
    const res = await fetch(
      `https://manga-site-er5s.onrender.com/collections/${username}`,
    );

    const collections = await res.json();
    console.log("Коллекции:", collections);

    // 🔥 получаем все манги
    const mangaRes = await fetch("https://manga-site-er5s.onrender.com/mangas");

    const mangas = await mangaRes.json();
    console.log("Манги:", mangas);

    container.innerHTML = "";

    // ❗ если нет коллекций
    if (!collections.length) {
      container.innerHTML = "<p>У вас пока нет коллекций</p>";
      return;
    }

    collections.forEach((collection) => {
      const block = document.createElement("div");
      block.className = "collection-block";

      const title = document.createElement("h2");
      title.textContent = collection.name;

      const cards = document.createElement("div");
      cards.className = "collection-row";

      // ❗ если коллекция пустая
      if (!collection.mangas || collection.mangas.length === 0) {
        cards.innerHTML = "<p>Пока пусто</p>";
      } else {
        collection.mangas.forEach((id) => {
          // 💥 ФИКС ID
          const manga = mangas.find((m) => String(m._id) === String(id));

          if (!manga) return;

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

          cards.appendChild(card);
        });
      }

      block.appendChild(title);
      block.appendChild(cards);

      container.appendChild(block);
    });
  } catch (err) {
    console.error("Ошибка загрузки коллекций:", err);
    container.innerHTML = "<p>Ошибка загрузки</p>";
  }
}

/* ===== СОЗДАНИЕ КОЛЛЕКЦИИ ===== */

createBtn.addEventListener("click", async () => {
  const username = localStorage.getItem("username");
  const name = input.value.trim();

  if (!name) {
    alert("Введите название коллекции");
    return;
  }

  try {
    const res = await fetch(
      "https://manga-site-er5s.onrender.com/collections/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
        }),
      },
    );

    const data = await res.json();
    console.log("Создание:", data);

    input.value = "";

    // 🔥 перезагрузка коллекций
    loadCollections();
  } catch (err) {
    console.error("Ошибка создания:", err);
    alert("Ошибка создания коллекции");
  }
});

/* ===== СТАРТ ===== */

loadCollections();
