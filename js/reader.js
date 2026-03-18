const params = new URLSearchParams(window.location.search);
const chapterId = params.get("chapter");

let pages = [];
let currentPage = 0;

const container = document.getElementById("pagesContainer");
const indicator = document.getElementById("pageIndicator");

async function loadPages() {
  const res = await fetch(
    `https://manga-site-er5s.onrender.com/pages/${chapterId}`,
  );
  const data = await res.json();

  pages = (data.pages || []).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  if (pages.length === 0) {
    container.innerHTML = "<p>Страницы не найдены</p>";
    return;
  }

  currentPage = 0;

  renderPage(); // показываем первую страницу только после загрузки
}

function renderPage() {
  container.innerHTML = "";

  const img = document.createElement("img");

  img.src = "https://manga-site-er5s.onrender.com" + pages[currentPage];

  img.style.maxWidth = "900px";
  img.style.width = "100%";
  img.style.display = "block";
  img.style.margin = "0 auto";

  container.appendChild(img);

  updateIndicator();
}

function updateIndicator() {
  if (!indicator) return;

  indicator.textContent = `Страница ${currentPage + 1} / ${pages.length}`;
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    currentPage++;
    renderPage();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
}

document.getElementById("nextBtn")?.addEventListener("click", nextPage);
document.getElementById("prevBtn")?.addEventListener("click", prevPage);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
});

container.addEventListener("click", (e) => {
  const x = e.clientX;

  if (x > window.innerWidth / 2) {
    nextPage();
  } else {
    prevPage();
  }
});

loadPages();
