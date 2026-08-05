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
  appId: "1:286513890572:web:f5b8dae4f2d0cfefd3b529",
  measurementId: "G-D6G6SPPTNV"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };