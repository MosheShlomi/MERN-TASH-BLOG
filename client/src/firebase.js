// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "tash-blog-7aaa7.firebaseapp.com",
    projectId: "tash-blog-7aaa7",
    storageBucket: "tash-blog-7aaa7.appspot.com",
    messagingSenderId: "235629204367",
    appId: "1:235629204367:web:2de929ade9236c9d1a71fa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);