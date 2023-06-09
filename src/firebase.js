import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLk10LqBV2ve7ig0uBB_1U3d5b3CE1_5Y",
    authDomain: "bibliotecacuc-5dc3f.firebaseapp.com",
    projectId: "bibliotecacuc-5dc3f",
    storageBucket: "bibliotecacuc-5dc3f.appspot.com",
    messagingSenderId: "244809272755",
    appId: "1:244809272755:web:eaad373bcb3977e02f8fc6"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);