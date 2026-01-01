// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9-Xv_ipbC4Ll0QH3i_EXfuH9DxIj336o",
  authDomain: "mythweaver-mvp.firebaseapp.com",
  projectId: "mythweaver-mvp",
  storageBucket: "mythweaver-mvp.firebasestorage.app",
  messagingSenderId: "432097224700",
  appId: "1:432097224700:web:a5e0f049e0ccaf8f13b479",
  measurementId: "G-WWGV9F358J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);