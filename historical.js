// historical.js

import { auth, db, onAuthStateChanged } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Global Variables
const totalOutlines = 3;
let currentOutline = 1;
let userDocRef = null;

// Correct answers for each mini-test (for demonstration purposes)
const correctAnswers = {
  1: "device",  // e.g., for Early Counting Devices quiz
  2: "abacus",  // e.g., for Mechanical Counting Devices quiz
  3: "electronic"  // e.g., for Electronic Counting Devices final quiz
};

// ----- Firebase Integration: Load or Create User Progress -----
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "welcome.html";
    return;
  }
  userDocRef = doc(db, "users", user.uid);
  let userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      historical: {
        progress: 0,
        completedOutlines: []
      }
    });
    userDocSnap = await getDoc(userDocRef);
  }
  const historicalData = userDocSnap.data().historical || { completedOutlines: [], progress: 0 };
  const completed = historicalData.completedOutlines || [];
  if (completed.length > 0) {
    currentOutline = Math.max(...completed) + 1;
    if (currentOutline > totalOutlines) currentOutline = totalOutlines;
  }
  unlockOutlines(completed);
  showSection(`outline-${currentOutline}`);
  updateOverallProgress();
});

// ----- Section Navigation -----
function showSection(sectionId) {
  const sections = document.querySelectorAll('.lesson-section');
  sections.forEach(section => section.classList.add('hidden'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.remove('hidden');
}

// ----- Outline Navigation (Updating the Outline List) -----
function unlockOutlines(completedArray) {
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
  // If a mini-test was passed, mark current outline as complete
  await markOutlineComplete(currentOutline);
  if (currentOutline < totalOutlines) {
    currentOutline++;
    unlockOutlines([].concat(getCompletedOutlines(), currentOutline - 1));
    showSection(`outline-${currentOutline}`);
    updateOverallProgress();
  } else {
    alert("Congratulations! You've completed the Historical Development lesson!");
  }
});

// ----- Mini Test Logic for Each Outline -----
const testButtons = document.querySelectorAll('.test-btn');
testButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const outlineNumber = parseInt(btn.getAttribute('data-outline'));
    const correctAnswer = correctAnswers[outlineNumber];
    const miniTestDiv = btn.parentElement;
    const radios = miniTestDiv.querySelectorAll('input[type="radio"]');
    let answered = false;
    let isCorrect = false;
    radios.forEach(radio => {
      if (radio.checked) {
        answered = true;
        if (radio.value === correctAnswer) isCorrect = true;
      }
    });
    if (!answered) {
      showModal("Please select an answer before submitting!");
      return;
    }
    if (isCorrect) {
      const funFacts = [
        "Great job! Early devices laid the groundwork for modern computing.",
        "Excellent! Understanding history is key to innovation.",
        "Awesome! Every great invention starts with simple ideas."
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
  modalMessage.textContent = message;
  modal.classList.remove('hidden');
}

// ----- Mark Outline as Complete and Update Firebase Progress -----
async function markOutlineComplete(outlineNumber) {
  const userDocSnap = await getDoc(userDocRef);
  const historicalData = userDocSnap.data().historical || { completedOutlines: [], progress: 0 };
  let completed = historicalData.completedOutlines || [];
  if (!completed.includes(outlineNumber)) {
    completed.push(outlineNumber);
  }
  const progressPercent = outlineNumber === totalOutlines ? 100 : Math.floor((completed.length / totalOutlines) * 100);
  await updateDoc(userDocRef, {
    "historical.completedOutlines": completed,
    "historical.progress": progressPercent
  });
}

// Helper: Get completed outlines from the DOM
function getCompletedOutlines() {
  const completed = [];
  document.querySelectorAll('#outline-list li.active').forEach(li => {
    completed.push(parseInt(li.getAttribute('data-outline')));
  });
  return completed;
}

// ----- Update Overall Progress Display -----
async function updateOverallProgress() {
  if (!userDocRef) return;
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) return;
  const historicalData = userDocSnap.data().historical || { completedOutlines: [], progress: 0 };
  const progress = historicalData.progress || 0;
  document.getElementById("overall-progress").style.width = progress + "%";
  document.getElementById("overall-progress-text").textContent = progress;
}

// ----- Navigation Buttons (Prev, Next, Mark Complete) -----
document.addEventListener('DOMContentLoaded', () => {
  const prevLessonBtn = document.getElementById('prev-lesson-btn');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const markCompleteBtn = document.getElementById('mark-complete-btn');

  if (prevLessonBtn) {
    prevLessonBtn.addEventListener('click', () => {
      if (currentOutline > 1) {
        currentOutline--;
        showSection(`outline-${currentOutline}`);
        updateOverallProgress();
      }
    });
  }

  if (nextLessonBtn) {
    nextLessonBtn.addEventListener('click', () => {
      console.log("Next button clicked. Current outline:", currentOutline);
      if (currentOutline < totalOutlines) {
        currentOutline++;
        showSection(`outline-${currentOutline}`);
        updateOverallProgress();
        console.log("Advanced to outline", currentOutline);
      } else {
        console.log("Already at the final outline");
      }
    });
  }
  

  if (markCompleteBtn) {
    markCompleteBtn.addEventListener('click', async () => {
      await markOutlineComplete(currentOutline);
      if (currentOutline < totalOutlines) {
        currentOutline++;
        showSection(`outline-${currentOutline}`);
      } else {
        alert("Congratulations! You've completed the Historical Development lesson!");
      }
      updateOverallProgress();
    });
  }

  // Hide all sections except the first outline
  for (let i = 2; i <= totalOutlines; i++) {
    const section = document.getElementById(`outline-${i}`);
    if (section) section.classList.add('hidden');
  }
  showSection('outline-1');
  updateOverallProgress();
});
