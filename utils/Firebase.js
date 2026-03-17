import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginlms-a7ea1.firebaseapp.com",
  projectId: "loginlms-a7ea1",
  storageBucket: "loginlms-a7ea1.appspot.com", // ✅ corrected key (was `.firebasestorage.app`)
  messagingSenderId: "665916718747",
  appId: "1:665916718747:web:16dbe0bfe5aeeface0903e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Optional: Force Google account selection every time (useful in dev)
provider.setCustomParameters({
  prompt: "select_account",
});

export { auth, provider };
