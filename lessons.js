// lessons.js
import { auth, db, onAuthStateChanged } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in? Redirect to welcome
    window.location.href = "welcome.html";
    return;
  }

  // Get user doc from Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    console.log("No user data found. Using defaults...");
    return;
  }

  const userData = userDocSnap.data();

  // 1) Recommended Courses
  const recommended = userData.recommendedCourses || {};

  // Fundamentals
  const fundamentalsProg = recommended.fundamentalsOfComputer?.progress ?? 0;
  updateProgress("fundamentals-progress", "fundamentals-progress-bar", fundamentalsProg);

  // Operating Systems
  const operatingSystemsProg = recommended.operatingSystems?.progress ?? 0;
  updateProgress("operating-systems-progress", "operating-systems-progress-bar", operatingSystemsProg);

  // Networking Basics
  const networkingBasicsProg = recommended.networkingBasics?.progress ?? 0;
  updateProgress("networking-basics-progress", "networking-basics-progress-bar", networkingBasicsProg);

  // Software Development
  const softwareDevProg = recommended.softwareDevelopment?.progress ?? 0;
  updateProgress("software-development-progress", "software-development-progress-bar", softwareDevProg);

  // 2) Special Courses
  const special = userData.specialCourses || {};

  // Cyber Security
  const cyberSecProg = special.cyberSecurity?.progress ?? 0;
  updateProgress("cyber-security-progress", "cyber-security-progress-bar", cyberSecProg);

  // Data Science
  const dataScienceProg = special.dataScience?.progress ?? 0;
  updateProgress("data-science-progress", "data-science-progress-bar", dataScienceProg);

  // Mobile App Dev
  const mobileAppDevProg = special.mobileAppDev?.progress ?? 0;
  updateProgress("mobile-app-dev-progress", "mobile-app-dev-progress-bar", mobileAppDevProg);

  // Product Design
  const productDesignProg = special.productDesign?.progress ?? 0;
  updateProgress("product-design-progress", "product-design-progress-bar", productDesignProg);
});

/**
 * updateProgress: sets both the numeric progress text and the fill width
 * @param {string} textId - The ID of the <span> that shows numeric progress
 * @param {string} barId - The ID of the progress-bar-fill div
 * @param {number} progressValue - The numeric progress (0 to 100)
 */
function updateProgress(textId, barId, progressValue) {
  const progressTextElem = document.getElementById(textId);
  const progressBarFillElem = document.getElementById(barId);

  if (progressTextElem) {
    progressTextElem.textContent = progressValue;
  }
  if (progressBarFillElem) {
    progressBarFillElem.style.width = `${progressValue}%`;
  }
}