const form = document.getElementById("chapterForm");
const mangaSelect = document.getElementById("mangaSelect");

async function loadMangas() {
  const res = await fetch("http://localhost:3000/mangas");
  const mangas = await res.json();

  mangas.forEach((manga) => {
    const option = document.createElement("option");

    option.value = manga._id;
    option.textContent = manga.title;

    mangaSelect.appendChild(option);
  });
}

loadMangas();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const res = await fetch("http://localhost:3000/chapters/add", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  alert(data.message);

  form.reset();
});
