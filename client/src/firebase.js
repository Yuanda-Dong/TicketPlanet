// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: "AIzaSyBecWfE-yHSNVU_urjiaMgnEC1V61Yd6BQ",

	authDomain: "ticketplanet-7c0dc.firebaseapp.com",

	projectId: "ticketplanet-7c0dc",

	storageBucket: "ticketplanet-7c0dc.appspot.com",

	messagingSenderId: "381936910997",

	appId: "1:381936910997:web:87dec7bf14d67a9ce5119c",

	measurementId: "G-45M6GL8H6D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
