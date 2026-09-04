import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDb5CFV7h0DkstYkkPQIwgmoi5YrJm7J5U",
    authDomain: "crop-era.firebaseapp.com",
    projectId: "crop-era",
    storageBucket: "crop-era.firebasestorage.app",
    messagingSenderId: "1045992321048",
    appId: "1:1045992321048:web:cd9d510b4ba5fcf6a8136d",
    measurementId: "G-BM90NQN034"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' }); 