import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "feasty-cfde8.firebaseapp.com",
  projectId: "feasty-cfde8",
  storageBucket: "feasty-cfde8.firebasestorage.app",
  messagingSenderId: "295025752875",
  appId: "1:295025752875:web:337c27ee6653bda821236e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

export { app, auth };