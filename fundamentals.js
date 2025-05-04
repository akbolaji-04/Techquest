import { auth, db, onAuthStateChanged } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Constants
const totalOutlines = 8;
let currentOutline = 1;
let userDocRef = null;

// Complete Lesson Data (Outlines 1–8)
const lessonData = {
  1: {
    title: "Introduction",
    content: `
      <p>Computers are electronic devices that process information. They are essential tools in the modern world.</p>
      <p>Key points:</p>
      <ul>
        <li>Definition of a computer</li>
        <li>Role in society</li>
        <li>Basic functionality</li>
      </ul>
      <img src="https://img.freepik.com/free-vector/desktop-computer-vconcept-illustration_114360-12153.jpg?uid=R61788073&ga=GA1.1.1120894039.1738793137&semt=ais_hybrid&w=740" alt="Introduction Image" loading="lazy">
    `,
    quiz: {
      question: "Which of the following best describes a computer?",
      options: [
        { value: "device", text: "An electronic device that processes data." },
        { value: "toy", text: "A toy gadget for fun." },
        { value: "book", text: "A manual for learning." }
      ],
      correct: "device"
    }
  },
  2: {
    title: "History & Evolution",
    content: `
      <p>Computers have evolved dramatically since the 1940s. Early mainframes led to personal PCs and now mobile computing.</p>
      <ul>
        <li>1940s: First electronic computers</li>
        <li>1960s-1980s: Mainframes & minicomputers</li>
        <li>1990s-present: PCs, laptops, smartphones</li>
      </ul>
      <img src="https://img.freepik.com/premium-photo/handmade-wooden-computer-white-background-full-body-view_899449-671326.jpg?uid=R61788073&ga=GA1.1.1120894039.1738793137&semt=ais_hybrid&w=740" alt="History Image" loading="lazy">
    `,
    quiz: {
      question: "In which decade were the first electronic computers developed?",
      options: [
        { value: "1940s", text: "1940s" },
        { value: "1960s", text: "1960s" },
        { value: "1980s", text: "1980s" }
      ],
      correct: "1940s"
    }
  },
  3: {
    title: "Types of Computers",
    content: `
      <p>Different classes of computers serve varied purposes, from supercomputers to smartphones.</p>
      <ul>
        <li>Supercomputers: High-performance tasks</li>
        <li>Desktops: General use</li>
        <li>Laptops: Portable computing</li>
        <li>Tablets & smartphones: Mobile devices</li>
      </ul>
      <img src="https://img.freepik.com/premium-photo/group-office-equipment-with-laptop-tablet_241146-474.jpg?uid=R61788073&ga=GA1.1.1120894039.1738793137&semt=ais_hybrid&w=740" alt="Types of Computers" loading="lazy">
    `,
    quiz: {
      question: "Which type of computer is designed for high-performance calculations?",
      options: [
        { value: "super", text: "Supercomputer" },
        { value: "laptop", text: "Laptop" },
        { value: "tablet", text: "Tablet" }
      ],
      correct: "super"
    }
  },
  4: {
    title: "Basic Components",
    content: `
      <p>Core hardware parts include CPU, RAM, storage, and input/output devices.</p>
      <ul>
        <li>CPU: The brain of the computer</li>
        <li>RAM: Temporary memory</li>
        <li>Storage: Permanent data</li>
        <li>Peripherals: Keyboard, mouse</li>
      </ul>
      <img src="https://img.freepik.com/free-vector/isometric-computer-parts-collection-with-monitor-video-card-drives-cable-wires-keyboard-mouse-system-unit-isolated_1284-38507.jpg?uid=R61788073&ga=GA1.1.1120894039.1738793137&semt=ais_hybrid&w=740" alt="Components Diagram" loading="lazy">
    `,
    quiz: {
      question: "Which component is known as the brain of the computer?",
      options: [
        { value: "cpu", text: "CPU" },
        { value: "ram", text: "RAM" },
        { value: "motherboard", text: "Motherboard" }
      ],
      correct: "cpu"
    }
  },
  5: {
    title: "How Computers Work",
    content: `
      <p>Computers process data through input, processing, storage, and output stages.</p>
      <img src="hhttps://img.freepik.com/free-vector/mother-son-using-laptop-vector_1308-133074.jpg?uid=R61788073&ga=GA1.1.1120894039.1738793137&semt=ais_hybrid&w=740" alt="Workflow Diagram" loading="lazy">
      <ul>
        <li>Input: Data entry</li>
        <li>Processing: Manipulation</li>
        <li>Storage: Saving data</li>
        <li>Output: Results display</li>
      </ul>
    `,
    quiz: {
      question: "What is the term for a computer receiving data?",
      options: [
        { value: "input", text: "Input" },
        { value: "processing", text: "Processing" },
        { value: "output", text: "Output" }
      ],
      correct: "input"
    }
  },
  6: {
    title: "Software vs Hardware",
    content: `
      <p>Software consists of programs, while hardware is the physical machine.</p>
      <img src="https://img.freepik.com/free-photo/close-up-man-repairing-computer-chips_23-2150880997.jpg?uid=R61788073&ga=GA1.1.1120894039.1738793137&semt=ais_hybrid&w=740" alt="Software vs Hardware" loading="lazy">
      <ul>
        <li>Software: OS, applications</li>
        <li>Hardware: CPU, memory, devices</li>
      </ul>
    `,
    quiz: {
      question: "Which one is considered software?",
      options: [
        { value: "os", text: "Operating System" },
        { value: "cpu", text: "CPU" },
        { value: "keyboard", text: "Keyboard" }
      ],
      correct: "os"
    }
  },
  7: {
    title: "Modern Trends",
    content: `
      <p>Emerging tech like cloud computing, AI, and IoT are shaping the future.</p>
      <ul>
        <li>Cloud Computing: Remote services</li>
        <li>Artificial Intelligence: Machine learning</li>
        <li>Internet of Things: Connected devices</li>
      </ul>
      <img src="https://img.freepik.com/premium-photo/headset-man-technology-virtual-vr_163305-210082.jpg?uid=R61788073&ga=GA1.1.1120894039.1738793137&semt=ais_hybrid&w=740" alt="Modern Trends" loading="lazy">
    `,
    quiz: {
      question: "Which trend refers to storing and accessing data over the Internet?",
      options: [
        { value: "cloud", text: "Cloud Computing" },
        { value: "desktop", text: "Desktop Computing" },
        { value: "analog", text: "Analog Processing" }
      ],
      correct: "cloud"
    }
  },
  8: {
    title: "Final Quiz",
    content: `<p>This final quiz tests all fundamentals.</p>`,
    quiz: {
      questions: [
        {
          text: "Which part of a computer processes instructions?",
          name: "q8_1",
          options: [
            { value: "cpu", text: "CPU" },
            { value: "ram", text: "RAM" },
            { value: "storage", text: "Storage" }
          ],
          correct: "cpu"
        },
        {
          text: "What does RAM stand for?",
          name: "q8_2",
          options: [
            { value: "random", text: "Random Access Memory" },
            { value: "read", text: "Readily Available Memory" },
            { value: "racing", text: "Rapid Access Memory" }
          ],
          correct: "random"
        }
      ]
    }
  }
};

// Render and Logic
function renderOutline(outlineNumber) {
  const mainContent = document.querySelector(".lesson-content");
  const outline = lessonData[outlineNumber];

  if (!outline) {
    console.error(`Outline ${outlineNumber} not found in lessonData.`);
    mainContent.innerHTML = `<p>Error: Lesson data not found for outline ${outlineNumber}.</p>`;
    return;
  }

  // Special case for the final quiz (outline 8)
  if (outlineNumber === 8) {
    if (!outline.quiz || !outline.quiz.questions) {
      console.error(`Quiz data for outline ${outlineNumber} is missing or invalid.`);
      mainContent.innerHTML = `
        <section class="lesson-section">
          <h2>${outlineNumber}. ${outline.title}</h2>
          ${outline.content}
          <p><strong>Quiz data is not available for this outline.</strong></p>
        </section>
      `;
      return;
    }

    // Render the final quiz
    mainContent.innerHTML = `
      <section class="lesson-section">
        <h2>${outlineNumber}. ${outline.title}</h2>
        ${outline.content}
        <div class="mini-test">
          ${outline.quiz.questions
            .map(
              (q) => `
              <p><strong>${q.text}</strong></p>
              ${q.options
                .map(
                  (option) =>
                    `<label><input type="radio" name="${q.name}" value="${option.value}"> ${option.text}</label><br>`
                )
                .join("")}
            `
            )
            .join("")}
          <button class="test-btn" data-outline="${outlineNumber}">Submit Final Quiz</button>
        </div>
      </section>
    `;

    // Attach event listener for the final quiz button
    document.querySelector(".test-btn").addEventListener("click", () => handleQuiz(outlineNumber));
    return;
  }

  // Default case for regular outlines
  if (!outline.quiz || !outline.quiz.options) {
    console.error(`Quiz data for outline ${outlineNumber} is missing or invalid.`);
    mainContent.innerHTML = `
      <section class="lesson-section">
        <h2>${outlineNumber}. ${outline.title}</h2>
        ${outline.content}
        <p><strong>Quiz data is not available for this outline.</strong></p>
      </section>
    `;
    return;
  }

  mainContent.innerHTML = `
    <section class="lesson-section">
      <h2>${outlineNumber}. ${outline.title}</h2>
      ${outline.content}
      <div class="mini-test">
        <p><strong>Mini Test:</strong> ${outline.quiz.question}</p>
        ${outline.quiz.options
          .map(
            (option) =>
              `<label><input type="radio" name="q${outlineNumber}" value="${option.value}"> ${option.text}</label><br>`
          )
          .join("")}
        <button class="test-btn" data-outline="${outlineNumber}">Submit Answer</button>
      </div>
    </section>
  `;

  // Attach event listener for the quiz button
  document.querySelector(".test-btn").addEventListener("click", () => handleQuiz(outlineNumber));
}

async function handleQuiz(n) {
  const data = lessonData[n];
  if (n < 8) {
    const sel = document.querySelector(`input[name=q${n}]:checked`);
    if (!sel) return showModal('Please select an answer!');
    if (sel.value === data.quiz.correct) {
      await completeOutline(n);
      if (n < totalOutlines) changeOutline(n + 1);
      return showModal('Correct! Well done.');
    }
    return showModal('Incorrect. Try again.');
  }

  // Final quiz
  let score = 0;
  data.quiz.questions.forEach((q) => {
    const sel = document.querySelector(`input[name=${q.name}]:checked`);
    if (sel && sel.value === q.correct) score++;
  });

  if (score === data.quiz.questions.length) {
    await completeOutline(8);
    showModal(`All correct! Score: ${score}/${data.quiz.questions.length}`);
    setTimeout(() => {
      window.location.href = "dashboard.html"; // Redirect to the dashboard
    }, 3000); // Wait 3 seconds before redirecting
    return;
  }

  showModal(`You got ${score}/${data.quiz.questions.length}. Review and retry.`);
}

function showModal(msg) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-message').textContent = msg;
  modal.classList.remove('hidden');
  document.getElementById('modal-close-btn')
    .addEventListener('click', () => modal.classList.add('hidden'), { once: true });
}

// Outline Navigation
function unlockOutlines(completed) {
  document.querySelectorAll('#outline-list li').forEach(li => {
    const num = +li.dataset.outline;
    li.classList.toggle('active', completed.includes(num) || num === currentOutline);
    li.classList.toggle('locked', !(completed.includes(num) || num === currentOutline));
    li.onclick = () => {
      if (!li.classList.contains('locked')) changeOutline(num);
    };
  });
}

function changeOutline(n) {
  currentOutline = n;
  renderOutline(n);
  updateProgressUI();
  unlockOutlines(currentOutlines());
}

function currentOutlines() {
  // compute completedOutlines + current
  return [...document.querySelectorAll('#outline-list li.active')].map(li => +li.dataset.outline);
}

// Mark complete and update
async function completeOutline(n) {
  const snap = await getDoc(userDocRef);
  const data = snap.data().fundamentals;
  const done = new Set(data.completedOutlines);
  done.add(n);
  const arr = Array.from(done).sort((a, b) => a - b);
  const pct = Math.floor((arr.length / totalOutlines) * 100);

  // Update Firestore with progress and lessons completed
  await updateDoc(userDocRef, {
    'fundamentals.completedOutlines': arr,
    'fundamentals.progress': pct,
    'fundamentals.lessonsCompleted': arr.length, // Update lessonsCompleted
  });

  // Update the progress bar in the UI
  updateProgressUI();
}

// Overall Progress Bar
async function updateProgressUI() {
  const snap = await getDoc(userDocRef);
  const pct = snap.data().fundamentals.progress;

  // Update the progress bar and text
  document.getElementById('overall-progress').style.width = pct + '%';
  document.getElementById('overall-progress-text').textContent = pct + '%';
}

// Prev/Next/Mark Buttons
document.getElementById('prev-lesson-btn').onclick = () => {
  if (currentOutline > 1) changeOutline(currentOutline-1);
};
document.getElementById('next-lesson-btn').onclick = () => {
  if (currentOutline < totalOutlines) changeOutline(currentOutline+1);
};
document.getElementById('mark-complete-btn').onclick = async () => {
  await completeOutline(currentOutline);

  if (currentOutline === totalOutlines) {
    // If the user is on the final lesson, redirect to the dashboard
    showModal("Congratulations! You've completed the course.");
    setTimeout(() => {
      window.location.href = "dashboard.html"; // Redirect to the dashboard
    }, 3000); // Wait 3 seconds before redirecting
  } else {
    // Otherwise, move to the next lesson
    changeOutline(currentOutline + 1);
  }
};


// Initial Firebase Auth & Render
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "welcome.html";
    return;
  }

  userDocRef = doc(db, "users", user.uid);
  const snap = await getDoc(userDocRef);

  if (!snap.exists()) {
    await setDoc(userDocRef, { fundamentals: { progress: 0, completedOutlines: [] } });
  }

  const data = (await getDoc(userDocRef)).data().fundamentals;
  const completed = data.completedOutlines || [];
  currentOutline = completed.length ? Math.min(completed.at(-1) + 1, totalOutlines) : 1;

  unlockOutlines(completed);
  renderOutline(currentOutline); // Ensure this is called
  updateProgressUI();
});
