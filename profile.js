document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");

  if (!username) {
    console.log("USERNAME NOT FOUND");
  }

  const usernameDisplay = document.getElementById("usernameDisplay");

  if (usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  /* ===== АВАТАР ===== */

  const avatarImg = document.getElementById("avatar");
  const avatarInput = document.getElementById("avatarInput");

  const savedAvatar = localStorage.getItem("avatar");

  if (savedAvatar && avatarImg) {
    avatarImg.src = savedAvatar;
  }

  if (avatarInput) {
    avatarInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (e) {
        const imageData = e.target.result;

        localStorage.setItem("avatar", imageData);

        avatarImg.src = imageData;
      };

      reader.readAsDataURL(file);
    });
  }

  /* ===== СЧЕТЧИК ИЗБРАННОГО ===== */

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const favCount = document.getElementById("favoritesCount");

  if (favCount) {
    favCount.textContent = favorites.length;
  }
});
