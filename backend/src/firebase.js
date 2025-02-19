// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTszJ5USkLLj7JjojTdkzWbDk09evV7mQ",
    authDomain: "techquest-8c736.firebaseapp.com",
    projectId: "techquest-8c736",
    storageBucket: "techquest-8c736.firebasestorage.app",
    messagingSenderId: "119226818766",
    appId: "1:119226818766:web:0c5d32a6c36d807b11709f",
    measurementId: "G-HCLCV11R2J"
  };
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    console.log("User Info:", user);

    // (Optional) Save user info to Firestore if needed here

  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export { auth, db, signInWithGoogle };
