const pull = document.getElementById("pull");
const rope = document.getElementById("rope");
const form = document.querySelector(".login-form");
const light = document.getElementById("light");

let isOn = false;

pull.addEventListener("click", toggleLamp);

function toggleLamp() {
  isOn = !isOn;

  if (isOn) {
    gsap.to(light, { opacity: 1, duration: 0.4 });

    gsap.to("body", {
      background: "#1c1f24",
      duration: 0.5,
    });

    gsap.to(form, {
      opacity: 1,
      y: 0,
      duration: 0.6,
    });
  } else {
    gsap.to(light, { opacity: 0, duration: 0.3 });

    gsap.to("body", {
      background: "#121417",
      duration: 0.5,
    });

    gsap.to(form, {
      opacity: 0,
      y: 40,
      duration: 0.3,
    });
  }
}
