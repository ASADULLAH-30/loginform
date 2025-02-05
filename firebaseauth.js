import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXASyGwTiXwd7qe--NgeGDYoGIVmLNMiY",
    authDomain: "login-form-43a5b.firebaseapp.com",
    projectId: "login-form-43a5b",
    storageBucket: "login-form-43a5b.appspot.com",  // Corrected storage URL
    messagingSenderId: "940666093279",
    appId: "1:940666093279:web:62b99b369648ea2363336a",
    measurementId: "G-SXY83FXSP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

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

// Google Sign-In Function
document.getElementById("googleSignIn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const userData = {
        email: user.email,
        firstName: user.displayName ? user.displayName.split(" ")[0] : "",
        lastName: user.displayName ? user.displayName.split(" ")[1] || "" : "",
        profilePic: user.photoURL || "",
      };

      await setDoc(doc(db, "users", user.uid), userData, { merge: true });

      showMessage("Google Login Successful", "signInMessage");
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "homepage.html";
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    showMessage(`Google Authentication Failed: ${error.message}`, "signInMessage");
  }
});

// Toggle Between Forms
document.getElementById("signUpButton").addEventListener("click", () => {
  document.getElementById("signIn").style.display = "none";
  document.getElementById("signup").style.display = "block";
});

document.getElementById("signInButton").addEventListener("click", () => {
  document.getElementById("signup").style.display = "none";
  document.getElementById("signIn").style.display = "block";
});

// Sign-Up Function
document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), { email, firstName, lastName });

    showMessage("Account Created Successfully", "signUpMessage");
    window.location.href = "index.html";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showMessage("Email Address Already Exists !!!", "signUpMessage");
    } else {
      showMessage("Unable to create User", "signUpMessage");
    }
  }
});

// Sign-In Function
document.getElementById("submitSignIn").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showMessage("Login is successful", "signInMessage");
    localStorage.setItem("loggedInUserId", userCredential.user.uid);
    window.location.href = "homepage.html";
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      showMessage("Incorrect Email or Password", "signInMessage");
    } else {
      showMessage("Account does not Exist", "signInMessage");
    }
  }
});
