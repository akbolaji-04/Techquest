// fundamentals.js

import { auth, db, onAuthStateChanged } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Global Variables
const totalOutlines = 8;
let currentOutline = 1;
let userDocRef = null;

// ----- Firebase Integration: Load or Create User Progress -----
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "welcome.html";
    return;
  }
  userDocRef = doc(db, "users", user.uid);
  let userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    // Create a default document for the fundamentals lesson
    await setDoc(userDocRef, {
      fundamentals: {
        progress: 0, // overall progress percentage
        completedOutlines: [] // array of completed outline numbers
      }
    });
    userDocSnap = await getDoc(userDocRef);
  }
  // Get current progress data
  const fundamentalsData = userDocSnap.data().fundamentals;
  const completed = fundamentalsData.completedOutlines || [];
  // Set currentOutline to one more than the max completed outline (min 1)
  if (completed.length > 0) {
    currentOutline = Math.max(...completed) + 1;
    if (currentOutline > totalOutlines) {
      currentOutline = totalOutlines;
    }
  }
  // Unlock outlines based on completed array
  unlockOutlines(completed);
  // Show the current outline section
  showSection(`outline-${currentOutline}`);
  updateOverallProgress();
});

// ----- Section Navigation -----
function showSection(sectionId) {
  const sections = document.querySelectorAll('.lesson-section');
  sections.forEach(section => section.classList.add('hidden'));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove('hidden');
  }
}

// ----- Outline Navigation (Updating the Outline List) -----
function unlockOutlines(completedArray) {
  // For each outline in the nav list, if its number is in completedArray, mark it as complete; otherwise, if it's the next outline to complete, unlock it.
  const items = document.querySelectorAll('#outline-list li');
  items.forEach(item => {
    const outlineNum = parseInt(item.getAttribute('data-outline'));
    if (completedArray.includes(outlineNum)) {
      item.classList.remove('locked');
      item.classList.add('active');
    } else if (outlineNum === currentOutline) {
      item.classList.remove('locked');
      item.classList.add('active');
    } else {
      item.classList.add('locked');
      item.classList.remove('active');
    }
  });
}

// ----- Modal Popup Logic for Quiz Feedback -----
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');

modalCloseBtn.addEventListener('click', async () => {
  modal.classList.add('hidden');
  // If the modal was shown after a successful mini-test, mark current outline as complete
  await markOutlineComplete(currentOutline);
  // Unlock next outline if exists
  if (currentOutline < totalOutlines) {
    currentOutline++;
    unlockOutlines([].concat(getCompletedOutlines(), currentOutline - 1));
    showSection(`outline-${currentOutline}`);
    updateOverallProgress();
  } else {
    alert("Congratulations! You've completed the Fundamentals lesson!");
  }
});

// ----- Mini Test (Quiz) Logic for Each Outline -----
const testButtons = document.querySelectorAll('.test-btn');
testButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const outlineNumber = parseInt(btn.getAttribute('data-outline'));
    // For demonstration purposes, assume the correct answer is the last radio option.
    const miniTestDiv = btn.parentElement;
    const radios = miniTestDiv.querySelectorAll('input[type="radio"]');
    let answered = false;
    let isCorrect = false;
    radios.forEach((radio, index) => {
      if (radio.checked) {
        answered = true;
        if (index === radios.length - 1) { // last option is considered correct
          isCorrect = true;
        }
      }
    });
    if (!answered) {
      showModal("Please select an answer before submitting!");
      return;
    }
    if (isCorrect) {
      const funFacts = [
        "Great job! Did you know the first computer weighed over 27 tons?",
        "Excellent! Computers operate in binary—0s and 1s!",
        "Awesome! The word 'computer' originally referred to people who computed."
      ];
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      showModal("Correct! " + randomFact);
    } else {
      showModal("Incorrect. Please review the section and try again!");
    }
  });
});

// ----- Modal Display Function -----
function showModal(message) {
  modalMessage.innerHTML = message;
  modal.classList.remove('hidden');
}

// ----- Mark Outline as Complete and Update Firebase Progress -----
async function markOutlineComplete(outlineNumber) {
  // Update local outline list (for demo, we'll assume marking is just adding the outline number to completedOutlines)
  const userDocSnap = await getDoc(userDocRef);
  let completed = userDocSnap.data().fundamentals.completedOutlines || [];
  if (!completed.includes(outlineNumber)) {
    completed.push(outlineNumber);
  }
  // Update overall progress: (number of completed outlines / totalOutlines) * 100
  const progressPercent = Math.floor((completed.length / totalOutlines) * 100);
  await updateDoc(userDocRef, {
    "fundamentals.completedOutlines": completed,
    "fundamentals.progress": progressPercent
  });
}

// Helper to get completed outlines from Firestore synchronously (for demo, we assume local variable, or you can cache it)
function getCompletedOutlines() {
  // For simplicity in this demo, we can read from the DOM (the nav items marked active and not locked)
  const completed = [];
  document.querySelectorAll('#outline-list li.active').forEach(li => {
    completed.push(parseInt(li.getAttribute('data-outline')));
  });
  return completed;
}

// Update overall progress display (read current outline from Firestore if needed)
async function updateOverallProgress() {
  const userDocSnap = await getDoc(userDocRef);
  const progress = userDocSnap.data().fundamentals.progress || 0;
  document.getElementById("overall-progress").style.width = progress + "%";
  document.getElementById("overall-progress-text").textContent = progress;
}

// ----- (Optional) Additional Firebase Integration -----
// You can add further logic to handle saving individual quiz scores, timestamps, etc.

// ----- Initialization: Show Only the First Outline Initially -----
document.addEventListener('DOMContentLoaded', () => {
  // Hide all sections except the first outline
  for (let i = 2; i <= totalOutlines; i++) {
    const section = document.getElementById(`outline-${i}`);
    if (section) {
      section.classList.add('hidden');
    }
  }
  showSection('outline-1');
  updateOverallProgress();
});