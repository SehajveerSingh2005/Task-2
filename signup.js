import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { doc, getFirestore, collection, getDocs,setDoc,addDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXIajxTK_g31he872G4xnM-nlZ9cmfz6k",
    authDomain: "bigg-boss-voting-zone.firebaseapp.com",
    databaseURL: "https://bigg-boss-voting-zone-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bigg-boss-voting-zone",
    storageBucket: "bigg-boss-voting-zone.appspot.com",
    messagingSenderId: "798018597331",
    appId: "1:798018597331:web:bc3f21b7e43acdffd2ff26",
    measurementId: "G-NPR5T4V3E6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const signupForm  =document.querySelector( 'form.signup' );
signupBtn.onclick = (()=>{
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
});
signupLink.onclick = (()=>{
  signupBtn.click();
  return false;
});

function showErrorMessage(message) {
  alert(message); // You can replace this with a more user-friendly approach
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('.login [placeholder="Email Address"]').value;
    const password = document.querySelector('.login [placeholder="Password"]').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Redirect to a new page after successful login
        window.location.href = 'landing.html';
    } catch (error) {
        console.error(error.code, error.message);
        let errorMessage = "Login failed. Incorrect Email or Password";
    showErrorMessage(errorMessage);
    }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phn = document.getElementById('phn').value.trim();
  const pwd = document.getElementById('pwd').value.trim();

  // Basic email validation (check for @ and .)
  if (!/\S+@\S+\.\S+/.test(email)) {
    showErrorMessage("Please enter a valid email address.");
    return;
  }

  // Basic password length validation (e.g., minimum 6 characters)
  if (pwd.length < 6) {
    showErrorMessage("Password must be at least 6 characters long.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pwd);
    const user = userCredential.user;

    // Store user details in Firestore
    await addDoc(collection(db, 'users'), {
      Username: username,
      Email: email,
      Phone: phn,
      UID: user.uid
    });

    // Redirect to a new page after successful signup
    window.location.href = 'landing.html';
  } catch (error) {
    console.error(error.code, error.message);
    showErrorMessage("Signup failed. Please check your details and try again.");
  }
});

const forgotPasswordBtn = document.getElementById("forgotpass");

forgotPasswordBtn.addEventListener("click", async () => {
  const email = document.querySelector(".login [placeholder='Email Address']").value;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Please check your inbox."); // Or use a more user-friendly notification
  } catch (error) {
    console.error(error.code, error.message);
    alert("Error sending password reset email. Please try again later."); // Or use a more user-friendly message
  }
});