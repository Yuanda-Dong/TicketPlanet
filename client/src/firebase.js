// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyACIi3Dg9L9y7RSIIQINIAljUVKABX1Apw',
  authDomain: 'project-4177137297351481009.firebaseapp.com',
  projectId: 'project-4177137297351481009',
  storageBucket: 'project-4177137297351481009.appspot.com',
  messagingSenderId: '739357768397',
  appId: '1:739357768397:web:7beb62758e291076e94784',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
