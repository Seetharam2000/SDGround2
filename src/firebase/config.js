import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDR3gyj6kDyM10-W8Ga0Ei7W6QkKwsFHQ",
  authDomain: "sdground-556c2.firebaseapp.com",
  projectId: "sdground-556c2",
  storageBucket: "sdground-556c2.firebasestorage.app",
  messagingSenderId: "315874460490",
  appId:  "1:315874460490:web:d1143376dd626b1bec37b3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
