const lamp = document.getElementById("lamp");

let lampOn = false;

lamp.addEventListener("click", () => {
  lampOn = !lampOn;

  if (lampOn) {
    document.body.style.background = "#000000";
  } else {
    document.body.style.background = "#080113";
  }
});
