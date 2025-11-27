import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const auth = getAuth();

function login() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "admin.html";  
    })
    .catch(() => {
      document.getElementById("error-msg").innerText = "Invalid Credentials!";
    });
}
