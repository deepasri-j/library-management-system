const np = document.querySelector("#new-password");
const cp = document.querySelector("#confirm-password");
const resetbtn = document.querySelector(".login-btn-submit");
const errormsg = document.querySelector("#passmismatch");
const oldpassword = localStorage.getItem("userPassword");
const checkConfirmPassword = function (np, cp) {
  if (np === cp) {
    return true;
  } else {
    return false;
  }
};

resetbtn.addEventListener("click", function (e) {
  e.preventDefault();
  const newpass = np.value;
  const confirmpass = cp.value;
  if (newpass === "" || confirmpass === "") {
    errormsg.textContent = "Password cannot be empty!";
    errormsg.style.color = "red";
    return;
  }

  const ismatch = checkConfirmPassword(newpass, confirmpass);

  if (!ismatch) {
    errormsg.textContent = "Passwords do not match";
    errormsg.style.color = "red";
    return;
  }
  if (newpass === oldpassword) {
    errormsg.textContent =
      "For security reasons, please choose a new password that you haven’t used before.";
    errormsg.style.color = "red";
    return;
  }
  if (newpass.length < 6) {
    errormsg.textContent = "Password is too short!!";
    return;
  }
  if (!/[A-Z]/.test(newpass)) {
    errormsg.textContent = "password must contain upper Case";
    return;
  }
  if (!/[0-9]/.test(newpass)) {
    errormsg.textContent = "password must contain numbers";
    return;
  } else {
    localStorage.setItem("userPassword", newpass);
    errormsg.textContent = "Password updated successfully!";
    errormsg.style.color = "green";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }
});
