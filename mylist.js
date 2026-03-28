document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");

  const res = await fetch(
    `https://manga-site-er5s.onrender.com/reading/${username}`,
  );
  const list = await res.json();

  const mangasRes = await fetch("https://manga-site-er5s.onrender.com/mangas");
  const mangas = await mangasRes.json();

  const containers = {
    reading: document.getElementById("reading"),
    planning: document.getElementById("planning"),
    completed: document.getElementById("completed"),
    dropped: document.getElementById("dropped"),
  };

  list.forEach((item) => {
    const manga = mangas.find((m) => m._id === item.mangaId);
    if (!manga) return;

    const card = document.createElement("div");
    card.className = "manga-card";

    card.innerHTML = `
   <img src="https://manga-site-er5s.onrender.com${manga.cover}">

   <div class="card-info">

   <h4>${manga.title}</h4>

   <div class="progress-text">
Глава ${item.progress || 0}
</div>

<div class="progress-bar">
<div class="progress-fill" style="width:${(item.progress || 0) * 10}%"></div>
</div>

<div class="progress-block">

<input 
type="number" 
value="${item.progress || 0}" 
min="0"
onchange="updateProgress('${manga._id}', this.value)"
>

</div>

<select onchange="updateStatus('${manga._id}', this.value)">
<option value="reading" ${item.status === "reading" ? "selected" : ""}>Читаю</option>
<option value="planning" ${item.status === "planning" ? "selected" : ""}>Планирую</option>
<option value="completed" ${item.status === "completed" ? "selected" : ""}>Завершено</option>
<option value="dropped" ${item.status === "dropped" ? "selected" : ""}>Брошено</option>
</select>

</div>
`;

    containers[item.status]?.appendChild(card);
  });
  document.getElementById("readingCount").textContent = list.filter(
    (m) => m.status === "reading",
  ).length;

  document.getElementById("planningCount").textContent = list.filter(
    (m) => m.status === "planning",
  ).length;

  document.getElementById("completedCount").textContent = list.filter(
    (m) => m.status === "completed",
  ).length;
});

async function updateStatus(mangaId, status) {
  const username = localStorage.getItem("username");

  await fetch("https://manga-site-er5s.onrender.com/reading/update", {
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

  location.reload();
}
async function updateProgress(mangaId, progress) {
  const username = localStorage.getItem("username");

  await fetch("https://manga-site-er5s.onrender.com/reading/progress", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      mangaId,
      progress,
    }),
  });
}
