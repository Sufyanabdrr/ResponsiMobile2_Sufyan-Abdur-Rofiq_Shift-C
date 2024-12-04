import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCRM24VAmusJcokZMj-AiwcuRT7oc5HRZw",
    authDomain: "responsimobile2-4a386.firebaseapp.com",
    projectId: "responsimobile2-4a386",
    storageBucket: "responsimobile2-4a386.appspot.com",
    messagingSenderId: "508719309233",
    appId: "1:508719309233:web:18b27e7fbc6b070da2dd90",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

// Exports
export { auth, googleProvider, db };
