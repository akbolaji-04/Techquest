import { auth, db, onAuthStateChanged } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Wait for Firebase Auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // If not signed in, send them back to the welcome page
    window.location.href = "welcome.html";
    return;
  }

  // Reference user document in Firestore
  const userDocRef = doc(db, "users", user.uid);

  try {
    // Fetch user document from Firestore
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Extract user data
      const userData = userDocSnap.data();
      const progressVal = userData.progress || 0; // Progress percentage
      const lessonsDone = userData.lessonsCompleted || 0; // Lessons completed
      const totalLess = userData.totalLessons || 10; // Total lessons
      const timeSpentVal = userData.timeSpent || 0; // Time spent in hours

      // Update the UI with the fetched data
      updateUI(progressVal, lessonsDone, totalLess, timeSpentVal);
    } else {
      // If the user document doesn't exist, initialize it
      await setDoc(userDocRef, {
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 10,
        timeSpent: 0
      });
      updateUI(0, 0, 10, 0);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

/**
 * updateUI: Updates the progress bar and text on the dashboard
 * @param {number} progress - Progress percentage (0 to 100)
 * @param {number} lessonsCompleted - Number of lessons completed
 * @param {number} totalLessons - Total number of lessons
 * @param {number} timeSpent - Time spent in hours
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