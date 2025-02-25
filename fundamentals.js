// lesson.js

// ----- Section Navigation -----
function showSection(sectionId) {
    const sections = document.querySelectorAll('.lesson-section');
    sections.forEach(section => {
      section.classList.add('hidden');
    });
    // Remove 'active' class from nav items
    document.querySelectorAll('.lesson-nav ul li').forEach(li => li.classList.remove('active'));
    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
    // Set the corresponding nav item as active
    document.querySelector(`.lesson-nav ul li[onclick*="${sectionId}"]`).classList.add('active');
  }
  
  // ----- Interactive Quiz Logic -----
  const checkQuizBtn = document.getElementById('check-quiz-btn');
  const quizFeedback = document.getElementById('quiz-feedback');
  
  checkQuizBtn.addEventListener('click', () => {
    // Retrieve answers
    const q1 = document.querySelector("input[name='q1']:checked");
    const q2 = document.querySelector("input[name='q2']:checked");
  
    if (!q1 || !q2) {
      quizFeedback.textContent = "Please answer all questions!";
      quizFeedback.style.color = "red";
      return;
    }
  
    let score = 0;
    let messages = [];
    
    // Question 1: Correct if answer is 'windows' (since Windows is software, not hardware)
    if (q1.value === 'windows') {
      score++;
      messages.push("Great! You know that Windows is not a hardware component.");
    } else {
      messages.push("Oops! Windows is software, not hardware.");
    }
    
    // Question 2: Correct answer is 'central_processing_unit'
    if (q2.value === 'central_processing_unit') {
      score++;
      messages.push("Excellent! CPU stands for Central Processing Unit.");
    } else {
      messages.push("Not quite! CPU means Central Processing Unit.");
    }
    
    // Surprise fun element if both answers are correct
    if (score === 2) {
      const funFacts = [
        "Surprise! The first computer weighed over 27 tons!",
        "Fun Fact: Computers operate using binary code (0s and 1s)!",
        "Did you know? The term 'computer' originally referred to people who performed calculations."
      ];
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      messages.push(randomFact);
    }
    
    quizFeedback.innerHTML = messages.join("<br>");
    quizFeedback.style.color = score === 2 ? "green" : "orange";
  });
  
  // ----- Mark Lesson as Complete & Update Progress (Firebase Integration Placeholder) -----
  const markCompleteBtn = document.getElementById('mark-complete-btn');
  const progressBar = document.getElementById('lesson-progress');
  const progressText = document.getElementById('progress-text');
  
  // Example: Firebase integration (replace with your Firebase code)
  // import { auth, db, onAuthStateChanged } from './firebase.js';
  // import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
  
  markCompleteBtn.addEventListener('click', async () => {
    // Placeholder: simulate marking lesson complete
    // In a real app, update the lesson progress in Firestore for the current user.
    const completeProgress = 100;
    progressBar.style.width = completeProgress + "%";
    progressText.textContent = completeProgress;
    alert("Congratulations! You have completed the lesson.");
  });
  
  // ----- Firebase Integration for Lesson Progress (Optional Placeholder) -----
  // onAuthStateChanged(auth, async (user) => {
  //   if (!user) {
  //     window.location.href = "welcome.html";
  //     return;
  //   }
  //   const userDocRef = doc(db, "users", user.uid);
  //   let userDocSnap = await getDoc(userDocRef);
  //   if (!userDocSnap.exists()) {
  //     await setDoc(userDocRef, { lessons: { fundamentalsOfComputer: { progress: 0 } } });
  //     userDocSnap = await getDoc(userDocRef);
  //   }
  //   const lessonProgress = userDocSnap.data().lessons?.fundamentalsOfComputer?.progress || 0;
  //   progressBar.style.width = lessonProgress + "%";
  //   progressText.textContent = lessonProgress;
  // });
  