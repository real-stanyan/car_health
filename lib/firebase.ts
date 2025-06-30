// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6ciyIZkj3PWS_rYyw6AKAi6gwYjB2lpM",
  authDomain: "car-health-49cc0.firebaseapp.com",
  projectId: "car-health-49cc0",
  storageBucket: "car-health-49cc0.firebasestorage.app",
  messagingSenderId: "414727124956",
  appId: "1:414727124956:web:0dbd6c3990ac46140a4119",
  measurementId: "G-9JYRQRPF4D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
