const fullName = document.querySelector("#fullname");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const signup = document.querySelector(".login-btn-submit");
const passerror = document.querySelector("#passwordError");
const accountCreated = document.querySelector("#successMessage");

const checkConfirmPassword = function (p, cp) {
  if (p === cp) {
    return true;
  } else {
    return false;
  }
};

signup.addEventListener("click", function (e) {
  e.preventDefault();

  const isMatch = checkConfirmPassword(password.value, confirmPassword.value);

  if (isMatch) {
    localStorage.setItem("userFullName", fullName.value);
    localStorage.setItem("userEmail", email.value.toLowerCase());
    localStorage.setItem("userPassword", password.value);
    passerror.textContent = "";
    accountCreated.textContent = "Account created Successfully!!";
    accountCreated.style.color = "green";
    accountCreated.style.textAlign = "center";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } else {
    passerror.textContent =
      "Password doesn't match! PLease enter the correct password!";
    passerror.style.color = "red";
  }
});

//html
// <div class="signup-link">
//         Don't have an account? <a href="signup.html">Sign Up</a>
//       </div>
