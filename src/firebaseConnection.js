import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyCapgJj-Ys5-jWWP-I9zW92PUExniHwzWk",
    authDomain: "react-firebase-a12a3.firebaseapp.com",
    projectId: "react-firebase-a12a3",
    storageBucket: "react-firebase-a12a3.appspot.com",
    messagingSenderId: "446351611604",
    appId: "1:446351611604:web:c58baf386e2e0838350d41"
  };

  const firebaseapp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseapp);
  const auth = getAuth(firebaseapp);

  export { db, auth };