// login.js  (MUST be first line)
console.log("login.js is loaded!");
import { auth } from "./firebase.js";  
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Attach login() to button
document.querySelector("button").addEventListener("click", login);

function login() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Redirect to admin page after login
      window.location.href = "admin.html";
    })
    .catch((error) => {
      document.getElementById("error-msg").innerText = error.message;
    });
}
