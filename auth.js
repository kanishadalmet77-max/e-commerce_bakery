// ============================================
// auth.js
// Handles signup, login, logout, and "who's logged in" —
// all using localStorage instead of a real database.
// Include this on EVERY page: <script src="auth.js"></script>
// ============================================

// ---- Internal helpers ----

// Reads the full list of registered users from localStorage.
// JSON.parse turns the saved text back into a real JS array.
// If nothing is saved yet, start with an empty array.
function getUsers() {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
}

// Saves the full user list back to localStorage.
// JSON.stringify turns the JS array into text, since localStorage
// can only ever store strings.
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ---- Signup ----
function signupUser(fullName, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return false;
    }

    const users = getUsers();

    const exists = users.some(function (u) { return u.email === email; });
    if (exists) {
        alert("An account with that email already exists. Try logging in instead.");
        return false;
    }

    // NOTE: password is stored in plain text here — fine for a
    // localStorage-only college demo, never do this on a real
    // production site with a real database.
    users.push({ fullName: fullName, email: email, password: password });
    saveUsers(users);

    alert("Account created! Please log in.");
    window.location.href = "login.html";
    return true;
}

// ---- Login ----
function loginUser(email, password) {
    const users = getUsers();
    const match = users.find(function (u) {
        return u.email === email && u.password === password;
    });

    if (!match) {
        alert("Invalid email or password.");
        return false;
    }

    // "Log them in" by saving who's currently logged in, separate
    // from the full user list.
    localStorage.setItem("currentUser", JSON.stringify({ fullName: match.fullName, email: match.email }));

    window.location.href = "index.html";
    return true;
}

// ---- Logout ----
function logoutUser() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// ---- Check who's logged in (used by other pages/nav) ----
function getCurrentUser() {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
}

// Call this at the top of any page that should require login first
function requireLogin() {
    if (!getCurrentUser()) {
        alert("Please log in first.");
        window.location.href = "login.html";
    }
}