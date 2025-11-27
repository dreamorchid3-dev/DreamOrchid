import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function () {   // EXPOSE FUNCTION GLOBALLY
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "admin.html";
    })
    .catch((error) => {
      document.getElementById("error-msg").innerText = "Invalid Credentials!";
      console.error(error);
    });

  console.log("Login button clicked");
};
