// Register
function register() {

    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();

    if (!username || !password) {
        alert("Username aur Password bharo");
        return;
    }

    localStorage.setItem("viktorixUser", username);
    localStorage.setItem("viktorixPass", password);

    alert("Account ban gaya!");

    window.location.href = "login.html";
}

// Login
function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const savedUser = localStorage.getItem("viktorixUser");
    const savedPass = localStorage.getItem("viktorixPass");

    if (username === savedUser && password === savedPass) {

        localStorage.setItem("loggedIn", "true");

        alert("Login Successful!");

        window.location.href = "index.html";

    } else {

        alert("Username ya Password galat hai");

    }

}

// Logout
function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "login.html";

}