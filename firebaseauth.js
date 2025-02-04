import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXASyGwTiXwd7qe--NgeGDYoGIVmLNMiY",
    authDomain: "login-form-43a5b.firebaseapp.com",
    projectId: "login-form-43a5b",
    storageBucket: "login-form-43a5b.firebasestorage.app",
    messagingSenderId: "940666093279",
    appId: "1:940666093279:web:62b99b369648ea2363336a",
    measurementId: "G-SXY83FXSP1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Show Messages
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign-Up Function
document.getElementById("submitSignUp").addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { email, firstName, lastName };

      setDoc(doc(db, "users", user.uid), userData)
        .then(() => {
          showMessage("Account Created Successfully", "signUpMessage");
          window.location.href = "index.html";
        })
        .catch((error) => console.error("Error writing document", error));
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        showMessage("Email Address Already Exists !!!", "signUpMessage");
      } else {
        showMessage("Unable to create User", "signUpMessage");
      }
    });
});

// Sign-In Function
document.getElementById("submitSignIn").addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("Login is successful", "signInMessage");
      localStorage.setItem("loggedInUserId", userCredential.user.uid);
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      if (error.code === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("Account does not Exist", "signInMessage");
      }
    });
});
