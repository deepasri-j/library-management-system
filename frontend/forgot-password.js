"use strict";
const email = document.getElementById("email");
const verification = document.getElementById("verification");
const form = document.querySelector("form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const userEmail = email.value.trim().toLowerCase();
  if (userEmail === "") {
    verification.textContent = "Email address should not be Empty!";
    verification.style.color = "red";
    return;
  }
  const response = await fetch("http://localhost:3000/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    verification.textContent = data.message;
    verification.style.color = "green";
    const resetLink = `reset-password.html?token=${data.resetToken}`;
    console.log("Reset Link:", resetLink);
  } else {
    verification.textContent = data.message;
    verification.style.color = "red";
  }
});
