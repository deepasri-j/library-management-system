const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const passMismatch = document.getElementById("passmismatch");
const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const password = newPassword.value;
  const confirm = confirmPassword.value;
  if (password !== confirm) {
    passMismatch.textContent = "Passwords do not match";
    passMismatch.style.color = "red";
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const response = await fetch("http://localhost:3000/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token, newPassword: password }),
  });
  const data = await response.json();
  if (response.ok) {
    passMismatch.textContent = data.message;
    passMismatch.style.color = "green";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } else {
    passMismatch.textContent = data.message;
    passMismatch.style.color = "red";
  }
});
