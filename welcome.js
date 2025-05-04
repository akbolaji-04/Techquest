// welcome.js

// Import Firebase modules from firebase.js
import { auth, provider, signInWithPopup, onAuthStateChanged } from "./firebase.js";

// Slideshow code (unchanged)
const slides = document.querySelectorAll('.slide-card');
let currentIndex = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 2000);

// Firebase Google Sign-In function
window.googleSignIn = function googleSignIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // Successful sign-in
      const user = result.user;
      // Update active slide's heading with the user's display name
      document.querySelector('.slide-card.active h2').textContent = `Welcome, ${user.displayName}`;
      // Optionally hide the sign-in button after sign-in
      document.getElementById("Signin-button").style.display = "none";
      alert("Welcome user")

      // NEW: Redirect to dashboard
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
    });
};

// Listen for authentication state changes to update UI automatically
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.querySelector('.slide-card.active h2').textContent = `Welcome, ${user.displayName}`;
    document.getElementById("Signin-button").style.display = "none";

    // NEW: If user is already signed in, redirect to dashboard
    window.location.href = "dashboard.html";
  } else {
    document.querySelector('.slide-card.active h2').textContent = `Welcome to TechQuest`;
    document.getElementById("Signin-button").style.display = "block";
  }
});
