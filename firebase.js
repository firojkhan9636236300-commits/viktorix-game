// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIn7EAxAnRdyD0PiJLIZ6VUy8WEwRwQOI",
  authDomain: "viktorix-game.firebaseapp.com",
  projectId: "viktorix-game",
  storageBucket: "viktorix-game.firebasestorage.app",
  messagingSenderId: "286513890572",
  appId: "1:286513890572:web:10e1b7e32097d053d3b529",
  measurementId: "G-SJLT046SYT"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

console.log("FIREBASE PROJECT:", app.options.projectId);
console.log("FIRESTORE READY:", !!db);
console.log("AUTH READY:", !!auth);

export { db, auth };
