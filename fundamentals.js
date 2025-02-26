// fundamentals.js

import { auth, db, onAuthStateChanged } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Global Variables
const totalOutlines = 8;
let currentOutline = 1;
let userDocRef = null;

// Correct answers for each mini-test (outline 1-7) and final quiz (outline 8: an object with multiple questions)
const correctAnswers = {
  1: "device",
  2: "1940s",
  3: "super",
  4: "cpu",
  5: "input",
  6: "os",
  7: "cloud",
  // For outline 8, we'll use an object where keys are question numbers
  8: {
    q1: "cpu",
    q2: "random" // For demonstration: correct answer for Q2 is "Random Access Memory"
  }
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
      fundamentals: {
        progress: 0,
        completedOutlines: []
      }
    });
    userDocSnap = await getDoc(userDocRef);
  }
  const fundamentalsData = userDocSnap.data().fundamentals || { completedOutlines: [], progress: 0 };
  const completed = fundamentalsData.completedOutlines || [];
  if (completed.length > 0) {
    currentOutline = Math.max(...completed) + 1;
    if (currentOutline > totalOutlines) {
      currentOutline = totalOutlines;
    }
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
  if (target) {
    target.classList.remove('hidden');
  }
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
  // If the modal was shown after a successful mini-test, mark current outline as complete
  await markOutlineComplete(currentOutline);
  if (currentOutline < totalOutlines) {
    currentOutline++;
    unlockOutlines([].concat(getCompletedOutlines(), currentOutline - 1));
    showSection(`outline-${currentOutline}`);
    updateOverallProgress();
  } else {
    alert("Congratulations! You've completed the Fundamentals lesson!");
  }
});

// ----- Mini Test Logic for Outlines 1-7 -----
const testButtons = document.querySelectorAll('.test-btn');
testButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const outlineNumber = parseInt(btn.getAttribute('data-outline'));
    if (outlineNumber < 8) {
      const correctAnswer = correctAnswers[outlineNumber];
      const miniTestDiv = btn.parentElement;
      const radios = miniTestDiv.querySelectorAll('input[type="radio"]');
      let answered = false;
      let isCorrect = false;
      radios.forEach(radio => {
        if (radio.checked) {
          answered = true;
          if (radio.value === correctAnswer) {
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
    } else {
      // Final Quiz (Outline 8): handle separately
      handleFinalQuiz();
    }
  });
});

// ----- Final Quiz Logic for Outline 8 -----
function handleFinalQuiz() {
  const miniTestDiv = document.querySelector('#outline-8 .mini-test');
  // For final quiz, we assume there are two questions:
  const q1 = miniTestDiv.querySelector("input[name='q8_1']:checked");
  const q2 = miniTestDiv.querySelector("input[name='q8_2']:checked");
  if (!q1 || !q2) {
    showModal("Please answer all final quiz questions!");
    return;
  }
  let score = 0;
  if (q1.value === correctAnswers[8].q1) score++;
  if (q2.value === correctAnswers[8].q2) score++;
  
  let message = "";
  if (score === 2) {
    const funFacts = [
      "Amazing! You really know your stuff!",
      "Outstanding! Computers and you are a perfect match!",
      "Brilliant! Keep up the great work!"
    ];
    message = "All correct! " + funFacts[Math.floor(Math.random() * funFacts.length)];
  } else {
    message = "You got " + score + " out of 2 correct. Review the lesson and try again!";
  }
  showModal(message);
}

// ----- Modal Display Function -----
function showModal(message) {
  modalMessage.textContent = message;
  modal.classList.remove('hidden');
}

// ----- Mark Outline as Complete & Update Firebase Progress -----
async function markOutlineComplete(outlineNumber) {
  const userDocSnap = await getDoc(userDocRef);
  const fundamentalsData = userDocSnap.data().fundamentals || { completedOutlines: [], progress: 0 };
  let completed = fundamentalsData.completedOutlines || [];
  if (!completed.includes(outlineNumber)) {
    completed.push(outlineNumber);
  }
  const progressPercent = outlineNumber === totalOutlines ? 100 : Math.floor((completed.length / totalOutlines) * 100);
  await updateDoc(userDocRef, {
    "fundamentals.completedOutlines": completed,
    "fundamentals.progress": progressPercent
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
  const fundamentalsData = userDocSnap.data().fundamentals || { completedOutlines: [], progress: 0 };
  const progress = fundamentalsData.progress || 0;
  document.getElementById("overall-progress").style.width = progress + "%";
  document.getElementById("overall-progress-text").textContent = progress;
}

// ----- Navigation Buttons for Prev/Next Lesson -----
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
      if (currentOutline < totalOutlines) {
        currentOutline++;
        showSection(`outline-${currentOutline}`);
        updateOverallProgress();
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
        alert("Congratulations! You've completed the Fundamentals lesson!");
      }
      updateOverallProgress();
    });
  }

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
