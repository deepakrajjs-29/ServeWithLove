import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeaayOGt3QV_s25yAhCjvrA8jpYt8bHM0",
  authDomain: "servewithlove-2909.firebaseapp.com",
  projectId: "servewithlove-2909",
  storageBucket: "servewithlove-2909.firebasestorage.app",
  messagingSenderId: "971870272021",
  appId: "1:971870272021:web:445970a4d13117c1d8ec1c",
  measurementId: "G-98518FLQ7M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

