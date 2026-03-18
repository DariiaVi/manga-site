const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("REGISTER SEND:", { email, username, password });

    if (!email || !username || !password) {
      alert("Заполни все поля");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Регистрация успешна!");

      window.location.href = "login.html";
    } catch (err) {
      alert("Ошибка соединения с сервером");
      console.error(err);
    }
  });
}
