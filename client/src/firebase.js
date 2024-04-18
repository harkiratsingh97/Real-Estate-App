// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: "mern-estate-eb5fb.firebaseapp.com",
	projectId: "mern-estate-eb5fb",
	storageBucket: "mern-estate-eb5fb.appspot.com",
	messagingSenderId: "1054471103598",
	appId: "1:1054471103598:web:36f17341a715995712f27f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
