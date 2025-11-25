function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  // Hardcoded (you can change anytime)
  if (user === "admin" && pass === "orchid123") {
    localStorage.setItem("loggedIn", "true");   // store login
    window.location.href = "admin.html";
  } else {
    document.getElementById("error-msg").innerText = "Invalid Credentials!";
  }
}
