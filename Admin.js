// Admin.js - VIKTORIX ADMIN PANEL

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// 🔐 YOUR ADMIN UID
const ADMIN_UID = "HXasVB2rOEPsd8kRc39lAedzlbg1";


const usersBox = document.getElementById("users");
const adminName = document.getElementById("adminName");


// ===============================
// CHECK ADMIN LOGIN
// ===============================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // UID check
  if (user.uid !== ADMIN_UID) {

    alert("Access Denied - Admin Only");

    await signOut(auth);

    window.location.href = "login.html";

    return;
  }


  adminName.innerText =
    "Welcome Admin 👑";


  loadUsers();

});


// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {

  usersBox.innerHTML = "Loading Users...";

  try {

    const snapshot = await getDocs(
      collection(db, "Users")
    );


    if (snapshot.empty) {

      usersBox.innerHTML =
        "<p>No users found.</p>";

      return;
    }


    let html = "";


    snapshot.forEach((item) => {

      const data = item.data();

      const username =
        data.username || "No username";

      const role =
        data.role || "user";

      const approved =
        data.approved === true;

      const points =
        data.points ?? 0;


      // Admin ko list me alag dikhayenge
      const isAdmin =
        item.id === ADMIN_UID ||
        role === "admin";


      html += `

        <div class="user-card">

          <h3 style="color:#00bfff;">
            ${isAdmin ? "👑 ADMIN" : "👤 USER"}
          </h3>

          <p>
            <b>Username:</b>
            ${username}
          </p>

          <p style="word-break:break-all;">
            <b>UID:</b>
            ${item.id}
          </p>

          <p>
            <b>Role:</b>
            ${role}
          </p>

          <p>
            <b>Approved:</b>
            ${approved ? "✅ Yes" : "❌ No"}
          </p>

          <p>
            <b>Points:</b>
            ${points}
          </p>


          ${
            !isAdmin
            ?
            `

            <button
              class="approve"
              onclick="approveUser('${item.id}', ${approved})"
            >
              ${approved ? "Approved ✅" : "Approve User"}
            </button>


            <br>


            <button
              class="add"
              onclick="addPoints('${item.id}', '${username}')"
            >
              ➕ Add Points
            </button>


            <button
              class="remove"
              onclick="removePoints('${item.id}', '${username}', ${points})"
            >
              ➖ Remove Points
            </button>

            `
            :
            `
            <p style="color:#00ff88;">
              👑 Main Administrator
            </p>
            `
          }

        </div>

      `;

    });


    usersBox.innerHTML = html;


  } catch (error) {

    console.error(error);

    usersBox.innerHTML = `

      <div style="
        background:#5a1111;
        padding:15px;
        border-radius:10px;
      ">

        <h3>Firebase Error</h3>

        <p style="word-break:break-word;">
          ${error.message}
        </p>

      </div>

    `;

  }

}


// ===============================
// APPROVE USER
// ===============================

window.approveUser = async function(uid, alreadyApproved) {

  if (alreadyApproved) {

    alert("User already approved.");

    return;
  }


  try {

    await updateDoc(
      doc(db, "Users", uid),
      {
        approved: true
      }
    );


    alert("User approved successfully ✅");


    loadUsers();


  } catch (error) {

    console.error(error);

    alert(
      "Approve failed: " +
      error.message
    );

  }

};


// ===============================
// ADD POINTS
// ===============================

window.addPoints = async function(uid, username) {

  const amount =
    prompt(
      "Kitne points add karne hain?\n\nUser: " +
      username
    );


  if (amount === null) return;


  const pointsToAdd =
    Number(amount);


  if (
    !Number.isFinite(pointsToAdd) ||
    pointsToAdd <= 0
  ) {

    alert("Valid points amount enter karo.");

    return;
  }


  try {

    const userRef =
      doc(db, "Users", uid);


    const snapshot =
      await getDocs(
        collection(db, "Users")
      );


    let currentPoints = 0;


    snapshot.forEach((item) => {

      if (item.id === uid) {

        currentPoints =
          Number(item.data().points || 0);

      }

    });


    await updateDoc(
      userRef,
      {
        points:
          currentPoints + pointsToAdd
      }
    );


    alert(
      pointsToAdd +
      " points successfully added ✅"
    );


    loadUsers();


  } catch (error) {

    console.error(error);

    alert(
      "Points add failed: " +
      error.message
    );

  }

};


// ===============================
// REMOVE POINTS
// ===============================

window.removePoints = async function(
  uid,
  username,
  currentPoints
) {

  const amount =
    prompt(
      "Kitne points remove karne hain?\n\nUser: " +
      username +
      "\nCurrent Points: " +
      currentPoints
    );


  if (amount === null) return;


  const pointsToRemove =
    Number(amount);


  if (
    !Number.isFinite(pointsToRemove) ||
    pointsToRemove <= 0
  ) {

    alert("Valid points amount enter karo.");

    return;
  }


  if (pointsToRemove > currentPoints) {

    alert(
      "User ke paas itne points nahi hain."
    );

    return;
  }


  try {

    await updateDoc(
      doc(db, "Users", uid),
      {
        points:
          Number(currentPoints) -
          pointsToRemove
      }
    );


    alert(
      pointsToRemove +
      " points successfully removed ✅"
    );


    loadUsers();


  } catch (error) {

    console.error(error);

    alert(
      "Points remove failed: " +
      error.message
    );

  }

};


// ===============================
// LOGOUT
// ===============================

document
  .getElementById("logout")
  .addEventListener(
    "click",
    async () => {

      await signOut(auth);

      window.location.href =
        "login.html";

    }
  );
