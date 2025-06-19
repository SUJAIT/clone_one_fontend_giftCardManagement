// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDAazkTscPPoNyBWa_zxDoh80EYjmNsLYQ",
//   authDomain: "giftcardmanagement-f7e9d.firebaseapp.com",
//   projectId: "giftcardmanagement-f7e9d",
//   storageBucket: "giftcardmanagement-f7e9d.firebasestorage.app",
//   messagingSenderId: "1028903554209",
//   appId: "1:1028903554209:web:7750dac62c0c82ae1e74e0",
//   measurementId: "G-S5S2P62JCP"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export default app;


// firebase.config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAazkTscPPoNyBWa_zxDoh80EYjmNsLYQ",
  authDomain: "giftcardmanagement-f7e9d.firebaseapp.com",
  projectId: "giftcardmanagement-f7e9d",
  storageBucket: "giftcardmanagement-f7e9d.firebasestorage.app",
  messagingSenderId: "1028903554209",
  appId: "1:1028903554209:web:7750dac62c0c82ae1e74e0",
  measurementId: "G-S5S2P62JCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
