import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC6w9ljQgEYty_nDSKaCt-dD2bEZuqHws",
  authDomain: "tabi3yfarm-a4e61.firebaseapp.com",
  projectId: "tabi3yfarm-a4e61",
  storageBucket: "tabi3yfarm-a4e61.firebasestorage.app",
  messagingSenderId: "822202080337",
  appId: "1:822202080337:web:e1f7da347dd31baaeb2c70",
  measurementId: "G-Y27G990YCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
