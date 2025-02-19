// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTszJ5USkLLj7JjojTdkzWbDk09evV7mQ",
  authDomain: "techquest-8c736.firebaseapp.com",
  projectId: "techquest-8c736",
  storageBucket: "techquest-8c736.firebasestorage.app",
  messagingSenderId: "119226818766",
  appId: "1:119226818766:web:0c5d32a6c36d807b11709f",
  measurementId: "G-HCLCV11R2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, onAuthStateChanged, db };
