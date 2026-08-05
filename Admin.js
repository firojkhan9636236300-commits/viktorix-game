// admin.js

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


let currentAdmin = null;


// Admin Check

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }


  try {

    const adminRef = doc(db, "Users", user.uid);
    const adminSnap = await getDoc(adminRef);


    if (!adminSnap.exists()) {

      alert("Access Denied");
      window.location.href = "index.html";
      return;

    }


    currentAdmin = adminSnap.data();


    if (currentAdmin.role !== "admin") {

      alert("Only Admin Allowed");
      window.location.href = "index.html";
      return;

    }


    document.getElementById("adminName").innerText =
    "Welcome " + currentAdmin.username;


    loadUsers();


  } catch(error){

    console.log(error);

  }


});





// Load All Users

async function loadUsers(){


const usersBox = document.getElementById("users");


usersBox.innerHTML="";


const snap = await getDocs(collection(db,"Users"));



snap.forEach((item)=>{


const user = item.data();


if(user.role === "admin") return;



usersBox.innerHTML += `


<div class="userCard">


<h3>${user.username || "No Name"}</h3>


<p>Points : ${user.points || 0}</p>


<p>
Approved :
${user.approved ? "YES":"NO"}
</p>



<button onclick="addPoints('${item.id}')">
+ Points
</button>


<button onclick="removePoints('${item.id}')">
- Points
</button>


<button onclick="approveUser('${item.id}')">
Approve
</button>


</div>


`;


});


}





// Add Points

window.addPoints = async(id)=>{


let amount = prompt("Points add karo");


if(!amount) return;


await updateDoc(doc(db,"Users",id),{

points: increment(Number(amount))

});


alert("Points Added");


loadUsers();


};





// Remove Points

window.removePoints = async(id)=>{


let amount = prompt("Points remove karo");


if(!amount) return;


await updateDoc(doc(db,"Users",id),{

points: increment(-Number(amount))

});


alert("Points Removed");


loadUsers();


};





// Approve User

window.approveUser = async(id)=>{


await updateDoc(doc(db,"Users",id),{

approved:true

});


alert("User Approved");


loadUsers();


};





// Logout

document.getElementById("logout").onclick = ()=>{


signOut(auth);


};