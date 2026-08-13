// auth.js

import { auth, db } from "./firebase.js";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// =====================
// PHONE REGISTER
// =====================

let confirmationResult = null;
let recaptchaVerifier = null;


// Send OTP
window.sendOTP = async function () {

  const usernameInput = document.getElementById("username");
  const phoneInput = document.getElementById("phone");
  const message = document.getElementById("message");

  const username = usernameInput.value.trim();
  let phone = phoneInput.value.trim();

  if (!username) {
    message.innerText = "Username bharo.";
    return;
  }

  if (!phone) {
    message.innerText = "Phone Number bharo.";
    return;
  }


  // India number ko +91 format me convert karo
  phone = phone.replace(/\s+/g, "");

  if (phone.startsWith("0")) {
    phone = "+91" + phone.substring(1);
  } else if (/^\d{10}$/.test(phone)) {
    phone = "+91" + phone;
  }


  // Phone format check
  if (!/^\+91\d{10}$/.test(phone)) {
    message.innerText =
      "India ka 10 digit mobile number dalo. Example: 9636236300";
    return;
  }


  // Input me normalized number dikhao
  phoneInput.value = phone;


  try {

    // reCAPTCHA sirf ek baar create hoga
    if (!recaptchaVerifier) {

      recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible"
        }
      );

      await recaptchaVerifier.render();
    }


    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      recaptchaVerifier
    );


    message.innerText =
      "OTP phone par bhej diya gaya.";

  } catch (error) {

    console.error(error);

    message.innerText = error.message;

    // Sirf failed hone par reCAPTCHA reset
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

  }

};


// =====================
// VERIFY OTP
// =====================

window.verifyOTP = async function () {

  const username = document.getElementById("username").value.trim();
  const otp = document.getElementById("otp").value.trim();
  const message = document.getElementById("message");


  if (!username || !otp) {
    message.innerText = "Username aur OTP bharo.";
    return;
  }


  if (!confirmationResult) {
    message.innerText = "Pehle Send OTP dabao.";
    return;
  }


  try {

    const result = await confirmationResult.confirm(otp);

    const user = result.user;


    // Firestore me user document
    await setDoc(
      doc(db, "Users", user.uid),
      {
        username: username,
        role: "user",
        approved: false,
        points: 0
      }
    );


    message.innerText =
      "Account ban gaya. Admin approval ka wait kare.";


    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);


  } catch (error) {

    console.error(error);

    message.innerText = error.message;

  }

};


// =====================
// EMAIL LOGIN - ADMIN / USER
// =====================

window.login = async function () {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();


  if (!username || !password) {
    alert("Email aur Password bharo");
    return;
  }


  try {

    const result = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );


    const uid = result.user.uid;


    const userDoc = await getDoc(
      doc(db, "Users", uid)
    );


    if (!userDoc.exists()) {
      alert("User data nahi mila");
      return;
    }


    const data = userDoc.data();


    if (
      data.role === "admin" &&
      data.approved === true
    ) {
      window.location.href = "admin.html";
      return;
    }


    if (
      data.role === "user" &&
      data.approved === true
    ) {
      window.location.href = "index.html";
      return;
    }


    alert("Admin approval pending hai.");

  } catch (error) {

    console.error(error);

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

    console.error(error);

    alert(error.message);

  }

};
