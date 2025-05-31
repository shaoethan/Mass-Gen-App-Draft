// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIaE6IlF3fwqGnisbGszaJ7VvBF8HYnpY",
  authDomain: "mgh-data.firebaseapp.com",
  projectId: "mgh-data",
  storageBucket: "mgh-data.firebasestorage.app",
  messagingSenderId: "74307631845",
  appId: "1:74307631845:web:6e7d97a1ee9febc843b20c",
  measurementId: "G-3GEXSLK02P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

