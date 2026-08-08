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
// AUTH + ADMIN CHECK
// ===============================

onAuthStateChanged(auth, async (user) => {

  const usersBox = document.getElementById("users");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    // STEP 1: Logged-in Firebase UID
    const uid = user.uid;

    // STEP 2: Admin document
    const adminRef = doc(db, "Users", uid);
    const adminSnap = await getDoc(adminRef);

    // Diagnostic information
    if (!adminSnap.exists()) {

      usersBox.innerHTML = `
        <div style="background:#5a1111;padding:15px;border-radius:10px;">
          <h3>Admin account not found</h3>
          <p>Login UID:</p>
          <p style="word-break:break-all;">${uid}</p>
          <p>Firestore path:</p>
          <p style="word-break:break-all;">
            Users/${uid}
          </p>
        </div>
      `;

      console.error("ADMIN DOCUMENT NOT FOUND");
      console.error("UID:", uid);

      return;
    }

    const adminData = adminSnap.data();

    // STEP 3: Role check
    if (adminData.role !== "admin") {

      usersBox.innerHTML = `
        <p style="color:#ff5555;">
          Admin role missing.
        </p>
        <p>
          Current role:
          ${adminData.role || "not found"}
        </p>
      `;

      return;
    }

    // STEP 4: Show admin name
    document.getElementById("adminName").innerText =
      "Welcome " + (adminData.username || "Admin");

    // STEP 5: Load users
    await loadUsers();

  } catch (error) {

    console.error("ADMIN ERROR:", error);

    usersBox.innerHTML = `
      <div style="background:#5a1111;padding:15px;border-radius:10px;">
        <h3>Firebase Error</h3>
        <p style="word-break:break-word;">
          ${error.message}
        </p>
      </div>
    `;

  }

});


// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {

  const usersBox = document.getElementById("users");

  usersBox.innerHTML = "<p>Loading Users...</p>";

  try {

    const snapshot = await getDocs(
      collection(db, "Users")
    );

    usersBox.innerHTML = "";

    let playerFound = false;

    snapshot.forEach((item) => {

      const user = item.data();

      // Admin ko player list me nahi dikhana
      if (user.role === "admin") {
        return;
      }

      playerFound = true;

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


      // + POINTS
      card.querySelector(".add").onclick = async () => {

        const amount = prompt(
          "Kitne points add karne hain?"
        );

        if (!amount) return;

        const number = Number(amount);

        if (!Number.isFinite(number) || number <= 0) {
          alert("Sahi points amount enter karo");
          return;
        }

        try {

          await updateDoc(
            doc(db, "Users", item.id),
            {
              points: increment(number)
            }
          );

          alert("Points Added");

          await loadUsers();

        } catch (error) {

          alert(
            "Points add nahi hue: " +
            error.message
          );

        }

      };


      // - POINTS
      card.querySelector(".remove").onclick = async () => {

        const amount = prompt(
          "Kitne points remove karne hain?"
        );

        if (!amount) return;

        const number = Number(amount);

        if (!Number.isFinite(number) || number <= 0) {
          alert("Sahi points amount enter karo");
          return;
        }

        try {

          await updateDoc(
            doc(db, "Users", item.id),
            {
              points: increment(-number)
            }
          );

          alert("Points Removed");

          await loadUsers();

        } catch (error) {

          alert(
            "Points remove nahi hue: " +
            error.message
          );

        }

      };


      // APPROVE
      card.querySelector(".approve").onclick = async () => {

        try {

          await updateDoc(
            doc(db, "Users", item.id),
            {
              approved: true
            }
          );

          alert("User Approved");

          await loadUsers();

        } catch (error) {

          alert(
            "User approve nahi hua: " +
            error.message
          );

        }

      };


      usersBox.appendChild(card);

    });


    if (!playerFound) {

      usersBox.innerHTML = `
        <p>
          Abhi koi player user nahi hai.
        </p>
      `;

    }

  } catch (error) {

    console.error(
      "LOAD USERS ERROR:",
      error
    );

    usersBox.innerHTML = `
      <div style="background:#5a1111;padding:15px;border-radius:10px;">
        <h3>Users load error</h3>
        <p style="word-break:break-word;">
          ${error.message}
        </p>
      </div>
    `;

  }

}


// ===============================
// LOGOUT
// ===============================

document
  .getElementById("logout")
  .addEventListener("click", async () => {

    try {

      await signOut(auth);

      window.location.href = "login.html";

    } catch (error) {

      alert(
        "Logout error: " +
        error.message
      );

    }

  });
