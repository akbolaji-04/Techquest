// dashboard.js
import { auth, db, onAuthStateChanged } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Wait for Firebase Auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // If not signed in, send them back to welcome page
    window.location.href = "welcome.html";
    return;
  }

  // Extract first name
  const firstName = user.displayName ? user.displayName.split(" ")[0] : "User";
  document.getElementById("username").textContent = firstName;

  // Reference user document in Firestore
  const userDocRef = doc(db, "users", user.uid);

  try {
    // Check if user doc exists
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // If doc doesn't exist, create it with some default progress
      await setDoc(userDocRef, {
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 10,
        timeSpent: 0
      });
      updateUI(0, 0, 10, 0);
    } else {
      // If doc exists, get the data
      const userData = userDocSnap.data();
      const progressVal = userData.progress || 0;
      const lessonsDone = userData.lessonsCompleted || 0;
      const totalLess = userData.totalLessons || 10;
      const timeSpentVal = userData.timeSpent || 0;
      updateUI(progressVal, lessonsDone, totalLess, timeSpentVal);
    }
  } catch (error) {
    console.error("Error fetching/creating user doc:", error);
  }
});

/**
 * updateUI: updates the progress bar and text
 * @param {number} progress - 0 to 100
 * @param {number} lessonsCompleted
 * @param {number} totalLessons
 * @param {number} timeSpent
 */
function updateUI(progress, lessonsCompleted, totalLessons, timeSpent) {
  // Update text
  document.getElementById("lessons-completed").textContent = lessonsCompleted;
  document.getElementById("total-lessons").textContent = totalLessons;
  document.getElementById("time-spent").textContent = `${timeSpent} hours`;

  // Update progress bar
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");
  progressBar.style.width = progress + "%";
  progressPercentage.textContent = `${progress}%`;
}
document.addEventListener("DOMContentLoaded", function () {
    const featureContainer = document.querySelector(".feature-card-container");
  
    let isDown = false;
    let startX;
    let scrollLeft;
  
    featureContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - featureContainer.offsetLeft;
      scrollLeft = featureContainer.scrollLeft;
    });
  
    featureContainer.addEventListener("mouseleave", () => {
      isDown = false;
    });
  
    featureContainer.addEventListener("mouseup", () => {
      isDown = false;
    });
  
    featureContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - featureContainer.offsetLeft;
      const walk = (x - startX) * 2; // Adjust scroll speed
      featureContainer.scrollLeft = scrollLeft - walk;
    });
  });
  
