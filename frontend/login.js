"use strict";

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const signin = document.querySelector(".btn-login");
const emailerror = document.querySelector("#emailError");
const passerror = document.querySelector("#passwordError");
const loginMsg = document.querySelector("#loginMessage");
const remember = document.querySelector("#remember");
// const userEmail = "deepa@gmail.com";
// const userPassword = "Dee1234";

//checkEmail
const checkEmail = function (em) {
  console.log("checkEmail received:", em);
  if (em.trim() === "") {
    emailerror.textContent = "Email Address should not be empty!!";
    return false;
  } else if (!em.includes("@") || !em.includes(".com")) {
    emailerror.textContent = "Please Enter Valid Email Address!";
    return false;
  } else {
    emailerror.textContent = "";
    return true;
  }
};

//checkPassword
const checkPassword = function (p) {
  if (p.trim() === "") {
    passerror.textContent = "Password Field should not be empty!!";
    return false;
  } else if (p.length < 6) {
    passerror.textContent = "Password is too short!!";
    return false;
  } else if (!/[A-Z]/.test(p)) {
    passerror.textContent = "password must contain upper Case";
    return false;
  } else if (!/[0-9]/.test(p)) {
    passerror.textContent = "password must contain numbers";
    return false;
  } else {
    passerror.textContent = "";
    return true;
  }
};

const Login = function (em, p) {
  const userEmail = localStorage.getItem("userEmail");
  const userPassword = localStorage.getItem("userPassword");

  if (checkEmail(em) && checkPassword(p)) {
    if (em === userEmail && p === userPassword) {
      loginMsg.textContent = "Login Success";
      loginMsg.style.color = "green";

      if (remember.checked) {
        localStorage.setItem("email", em);
      } else {
        localStorage.removeItem("email");
      }
      window.location.href = "dashboard.html";
    } else {
      loginMsg.textContent = "Invalid Credentials";
      loginMsg.style.color = "red";
    }
  } else {
    loginMsg.textContent = "Fix Validation Errors!!";
    loginMsg.style.color = "red";
  }
};

signin.addEventListener("click", function (e) {
  e.preventDefault();

  const em = email.value.toLowerCase();
  const p = password.value;
  console.log(em, p);
  Login(em, p);
});

window.addEventListener("load", function () {
  const savedEmail = localStorage.getItem("email");

  if (savedEmail) {
    email.value = savedEmail;
    remember.checked = true;
  }
});
