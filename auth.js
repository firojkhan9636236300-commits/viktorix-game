// auth.js

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// =====================
// REGISTER
// =====================

window.register = async function () {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Email aur Password bharo");
    return;
  }

  try {

    // Gmail se register/login
    const email = username;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "Users", user.uid), {
      username: email,
      role: "user",
      approved: false,
      points: 0
    });

    alert("Account ban gaya. Admin approval ka wait kare.");

    window.location.href = "login.html";

  } catch (error) {

    alert(error.message);

  }

};


// =====================
// LOGIN
// =====================

window.login = async function () {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Email aur Password bharo");
    return;
  }

  try {

    const email = username;

    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
        const uid = result.user.uid;

    const userDoc = await getDoc(doc(db, "Users", uid));

    if (!userDoc.exists()) {
      alert("User data nahi mila");
      return;
    }

    const data = userDoc.data();

    if (data.role === "admin" && data.approved === true) {
      window.location.href = "admin.html";
      return;
    }

    if (data.role === "user" && data.approved === true) {
      window.location.href = "index.html";
      return;
    }

    alert("Admin approval pending hai.");

  } catch (error) {

    alert(error.message);

  }

};


// =====================
// ADMIN LOGIN
// =====================

window.adminLogin = window.login;


// =====================
// LOGOUT
// =====================
window.logout = async function () {

  try {

    await signOut(auth);

    alert("Logout successful");

    window.location.href = "login.html";

  } catch (error) {

    alert(error.message);

  }

};