import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Define your courses
const courses = [
  {
    title: "Fundamentals of Computer",
    image: "assests/Computer.png",
    progress: 0,
    link: "fundamentals.html",
    category: "recommended",
  },
  {
    title: "History of Computer",
    image: "assests/history of computer.jpg",
    progress: 0,
    link: "history.html",
    category: "recommended",
  },
  {
    title: "Cyber Security",
    image: "assests/cyber_security.jpg",
    progress: 0,
    link: "cybersecurity.html",
    category: "special",
  },
];

// Function to add courses to Firestore
async function uploadCourses() {
  const coursesCollection = collection(db, "courses");

  for (const course of courses) {
    try {
      await addDoc(coursesCollection, course);
      console.log(`Course "${course.title}" added successfully.`);
    } catch (error) {
      console.error(`Error adding course "${course.title}":`, error);
    }
  }
}

// Call the function to upload courses
uploadCourses();