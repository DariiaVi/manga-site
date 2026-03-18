const form = document.getElementById("mangaForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const res = await fetch("https://manga-site-er5s.onrender.com/add", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  alert(data.message);

  form.reset();
});
