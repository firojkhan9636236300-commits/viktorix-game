// Admin.js - Diagnostic Version

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


onAuthStateChanged(auth, async (user) => {

  const usersBox = document.getElementById("users");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const uid = user.uid;

    // Firestore Users collection ke saare documents read karo
    const snapshot = await getDocs(
      collection(db, "Users")
    );

    let html = `
      <div style="
        background:#05224d;
        padding:15px;
        border-radius:10px;
        text-align:left;
      ">

      <h3 style="color:#00bfff;">
        Firebase Check
      </h3>

      <p>
        Login UID:
      </p>

      <p style="word-break:break-all;">
        ${uid}
      </p>

      <hr>

      <p>
        Firestore Users Documents:
      </p>
    `;

    if (snapshot.empty) {

      html += `
        <p style="color:#ff5555;">
          Users collection EMPTY hai.
        </p>
      `;

    } else {

      snapshot.forEach((item) => {

        const data = item.data();

        html += `
          <hr>

          <p>
            <b>Document ID:</b>
          </p>

          <p style="word-break:break-all;">
            ${item.id}
          </p>

          <p>
            <b>Username:</b>
            ${data.username || "No username"}
          </p>

          <p>
            <b>Role:</b>
            ${data.role || "No role"}
          </p>

          <p>
            <b>Approved:</b>
            ${data.approved === true ? "true" : "false"}
          </p>

          <p>
            <b>Points:</b>
            ${data.points ?? 0}
          </p>
        `;

      });

    }

    html += `
      </div>
    `;

    usersBox.innerHTML = html;

    document.getElementById("adminName").innerText =
      "Welcome Admin";


  } catch (error) {

    console.error(error);

    usersBox.innerHTML = `
      <div style="
        background:#5a1111;
        padding:15px;
        border-radius:10px;
        text-align:left;
      ">

        <h3>Firebase Error</h3>

        <p style="word-break:break-word;">
          ${error.message}
        </p>

      </div>
    `;

  }

});


// Logout

document.getElementById("logout").addEventListener(
  "click",
  async () => {

    await signOut(auth);

    window.location.href = "login.html";

  }
);
