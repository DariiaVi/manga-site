const loginBtn = document.getElementById("loginSubmitBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("LOGIN SEND:", { username, password });

    if (!username || !password) {
      alert("Заполни все поля");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("username", data.username);
      window.location.href = "http://localhost:5173/";
    } catch (err) {
      alert("Ошибка соединения с сервером");
      console.error(err);
    }
  });
}
