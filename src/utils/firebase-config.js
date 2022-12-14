// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASCk0_kgrNSI0RZ_oK74-cnzF2yZ40Twc",
  authDomain: "react-netflix-clone-72125.firebaseapp.com",
  projectId: "react-netflix-clone-72125",
  storageBucket: "react-netflix-clone-72125.appspot.com",
  messagingSenderId: "967882405447",
  appId: "1:967882405447:web:e5444e3593068c5d0f2362",
  measurementId: "G-K1LV8DZ705"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);