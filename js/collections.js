const container = document.getElementById("collectionsContainer");
const createBtn = document.getElementById("createCollectionBtn");
const input = document.getElementById("collectionName");

async function loadCollections() {
  const username = localStorage.getItem("username");

  if (!username) {
    container.innerHTML = "<p>Сначала войдите в аккаунт</p>";
    return;
  }

  const res = await fetch(
    `https://manga-site-er5s.onrender.com/collections/${username}`,
  );
  const collections = await res.json();

  const mangaRes = await fetch("https://manga-site-er5s.onrender.com/mangas");
  const mangas = await mangaRes.json();

  container.innerHTML = "";

  collections.forEach((collection) => {
    const block = document.createElement("div");
    block.className = "collection-block";

    const title = document.createElement("h2");
    title.textContent = collection.name;

    const cards = document.createElement("div");
    cards.className = "collection-row";

    collection.mangas.forEach((id) => {
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

    block.appendChild(title);
    block.appendChild(cards);

    container.appendChild(block);
  });
}

createBtn.addEventListener("click", async () => {
  const username = localStorage.getItem("username");
  const name = input.value.trim();

  if (!name) return;

  await fetch("https://manga-site-er5s.onrender.com/collections/create", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      name,
    }),
  });

  input.value = "";

  loadCollections();
});

loadCollections();
