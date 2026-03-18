const index = localStorage.getItem("currentCollection");

let collections = JSON.parse(localStorage.getItem("collections") || "[]");

const collection = collections[index];

document.getElementById("collectionTitle").textContent = collection.name;

const container = document.getElementById("collectionMangas");

collection.mangas.forEach((mangaId) => {
  const card = document.createElement("div");

  card.className = "manga-card";

  card.innerHTML = `
Манга ID: ${mangaId}
`;

  container.appendChild(card);
});
