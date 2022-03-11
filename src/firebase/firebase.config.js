import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4GZ-O4r34fByd3Wxnh6pMyOB8LDbis7I",
  authDomain: "react-house-listing.firebaseapp.com",
  projectId: "react-house-listing",
  storageBucket: "react-house-listing.appspot.com",
  messagingSenderId: "760791925594",
  appId: "1:760791925594:web:b9319887672a0193f1e963",
};
// init firebase
initializeApp(firebaseConfig);
// firestore db
export const db = getFirestore();
