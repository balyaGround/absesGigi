// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCM23EHrQtQkaAFoOJmOyBhLKf9Vl3OxP8",
  authDomain: "abses-gigi.firebaseapp.com",
  projectId: "abses-gigi",
  storageBucket: "abses-gigi.appspot.com",
  messagingSenderId: "1079045972497",
  appId: "1:1079045972497:web:c84c6b4d2921761a5247b0",
  measurementId: "G-1JCZ0CC9H4"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Service: Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
