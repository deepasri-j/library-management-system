const resetbtn = document.querySelector(".login-btn-submit");
const email = document.querySelector("#email");
const msg = document.querySelector("#verification");
const userEmail = localStorage.getItem("userEmail");

resetbtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (email.value.toLowerCase() === userEmail) {
    msg.textContent = "Email verified!";
    msg.style.color = "green";
    setTimeout(() => {
      window.location.href = "reset-password.html";
    }, 500);
  } else {
    msg.textContent = "Email not registered!";
    msg.style.color = "red";
  }
});
