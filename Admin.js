// Admin.js

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================
// ADMIN LOGIN CHECK
// ===============================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    // Current logged-in user ka Firestore document
    const adminRef = doc(db, "Users", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      alert("Admin account not found");
      await signOut(auth);
      window.location.href = "login.html";
      return;
    }

    const adminData = adminSnap.data();

    // Admin check
    if (adminData.role !== "admin") {
      alert("Only Admin Allowed");
      await signOut(auth);
      window.location.href = "login.html";
      return;
    }

    // Admin name
    document.getElementById("adminName").innerText =
      "Welcome " + (adminData.username || "Admin");

    // Users load karo
    await loadUsers();

  } catch (error) {

    console.error("Admin Error:", error);

    document.getElementById("users").innerHTML =
      "<p>Users load nahi ho pa rahe.</p>" +
      "<p style='color:#ff5555;'>Error: " +
      error.message +
      "</p>";

  }

});


// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {

  const usersBox = document.getElementById("users");

  usersBox.innerHTML = "<p>Loading Users...</p>";

  try {

    const usersRef = collection(db, "Users");
    const snapshot = await getDocs(usersRef);

    usersBox.innerHTML = "";

    let userFound = false;

    snapshot.forEach((item) => {

      const user = item.data();

      // Admin ko users list me mat dikhao
      if (user.role === "admin") {
        return;
      }

      userFound = true;

      const card = document.createElement("div");
      card.className = "user-card";

      card.innerHTML = `
        <h3>${user.username || "No Name"}</h3>

        <p>
          Points: ${user.points || 0}
        </p>

        <p>
          Approved:
          ${user.approved === true ? "YES" : "NO"}
        </p>

        <button class="add">
          + Points
        </button>

        <button class="remove">
          - Points
        </button>

        <button class="approve">
          Approve
        </button>
      `;

      // Add Points
      card.querySelector(".add").onclick = async () => {

        const amount = prompt("Kitne points add karne hain?");

        if (!amount) return;

        const number = Number(amount);

        if (!Number.isFinite(number) || number <= 0) {
          alert("Sahi points amount enter karo");
          return;
        }

        try {

          await updateDoc(doc(db, "Users", item.id), {
            points: increment(number)
          });

          alert("Points Added");
          await loadUsers();

        } catch (error) {

          alert("Points add nahi hue: " + error.message);

        }

      };


      // Remove Points
      card.querySelector(".remove").onclick = async () => {

        const amount = prompt("Kitne points remove karne hain?");

        if (!amount) return;

        const number = Number(amount);

        if (!Number.isFinite(number) || number <= 0) {
          alert("Sahi points amount enter karo");
          return;
        }

        try {

          await updateDoc(doc(db, "Users", item.id), {
            points: increment(-number)
          });

          alert("Points Removed");
          await loadUsers();

        } catch (error) {

          alert("Points remove nahi hue: " + error.message);

        }

      };


      // Approve User
      card.querySelector(".approve").onclick = async () => {

        try {

          await updateDoc(doc(db, "Users", item.id), {
            approved: true
          });

          alert("User Approved");
          await loadUsers();

        } catch (error) {

          alert("User approve nahi hua: " + error.message);

        }

      };


      usersBox.appendChild(card);

    });


    if (!userFound) {

      usersBox.innerHTML =
        "<p>Abhi koi player user nahi hai.</p>";

    }

  } catch (error) {

    console.error("Load Users Error:", error);

    usersBox.innerHTML =
      "<p style='color:#ff5555;'>Users load nahi ho pa rahe.</p>" +
      "<p style='font-size:13px;'>" +
      error.message +
      "</p>";

  }

}


// ===============================
// LOGOUT
// ===============================

document.getElementById("logout").addEventListener("click", async () => {

  try {

    await signOut(auth);
    window.location.href = "login.html";

  } catch (error) {

    alert("Logout error: " + error.message);

  }

});
