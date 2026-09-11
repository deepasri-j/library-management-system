"use strict";
const email = document.getElementById("userEmail");
const password = document.getElementById("userPassword");
const loginMsg = document.getElementById("loginMsg");
const remember = document.getElementById("remember");
const signin = document.querySelector(".btn-login");
const passerror = document.querySelector("#passwordError");
const emailerror = document.getElementById("emailError");
//check Email
const checkEmail = function (em) {
  if (em.trim() === "") {
    emailerror.textContent = "Email Address should not be empty!!";
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    emailerror.textContent = "Please enter a valid Email Address!";
    return false;
  } else {
    emailerror.textContent = "";
    return true;
  }
};

//chcek password
const checkPassword = function (p) {
  if (p.trim() === "") {
    passerror.textContent = "Password field should not be empty!!";
    return false;
  } else if (p.length < 6) {
    passerror.textContent = "Password is too short!!";
    return false;
  } else if (!/[A-Z]/.test(p)) {
    passerror.textContent = "Password must contain Uppercase letter";
    return false;
  } else if (!/[0-9]/.test(p)) {
    passerror.textContent = "Password must contain numbers";
    return false;
  } else {
    passerror.textContent = "";
    return true;
  }
};
const Login = async function (em, p) {
  if (checkEmail(em) && checkPassword(p)) {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: em,
        password: p,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      loginMsg.textContent = data.message;
      loginMsg.style.color = "green";

      if (remember.checked) {
        localStorage.setItem("email", em);
      } else {
        localStorage.removeItem("email");
      }
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "dashboard.html";
    } else {
      loginMsg.textContent = data.message;
      loginMsg.style.color = "red";
    }
  } else {
    loginMsg.textContent = "Fix Validation Errors!!";
    loginMsg.style.color = "red";
  }
};
//sign in
signin.addEventListener("click", function (e) {
  e.preventDefault();
  const em = email.value.toLowerCase();
  const p = password.value;
  console.log(em, p);
  Login(em, p);
});

//remember email
window.addEventListener("load", function () {
  const savedEmail = localStorage.getItem("email");
  if (savedEmail) {
    email.value = savedEmail;
    remember.checked = true;
  }
});
