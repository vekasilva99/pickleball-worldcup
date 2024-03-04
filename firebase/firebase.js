// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4V-RsWpoI_QWTLjKBQ5R8sa9wg9VD23w",
  authDomain: "pickleball-worldcup.firebaseapp.com",
  projectId: "pickleball-worldcup",
  storageBucket: "pickleball-worldcup.appspot.com",
  messagingSenderId: "842375194233",
  appId: "1:842375194233:web:6065525fe0a38c70c616a8",
  measurementId: "G-4XS3T9KZSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage,auth };