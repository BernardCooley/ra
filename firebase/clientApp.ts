// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";

// const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

// export default firebase;

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAOEP7AgSVx2rVg27WeL6BB01Dy9S6ZnKg",
    authDomain: "ra-promoters.firebaseapp.com",
    projectId: "ra-promoters",
    storageBucket: "ra-promoters.appspot.com",
    messagingSenderId: "771955879659",
    appId: "1:771955879659:web:7bdaa1af40bcdc4928d8ae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
