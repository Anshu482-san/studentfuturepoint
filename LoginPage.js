 // ✅ Firebase Imports (Ensure firebaseConfig.js exists)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    sendPasswordResetEmail, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { app, db } from "./firebaseConfig.js"; // ✅ Ensure this file exists

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Login Function (Email & Password)
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            alert("Please verify your email before logging in.");
            return;
        }

        // Fetch user role from Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role ? userData.role.toLowerCase() : "student"; // Default to student
            
            console.log("User Role:", role);

            if (role === "admin") {
                window.location.href = "adminDashboard.html";
            } else {
                window.location.href = "studentDashboard.html";
            }
        } else {
            alert("User data not found in database.");
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
    }
});

// ✅ Google Login Function
document.getElementById("googleLogin").addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Store user role only if it's not in Firestore
            await setDoc(userRef, { role: "student", email: user.email });
        }

        console.log("✅ Google Login Successful!");
        window.location.href = "studentDashboard.html";
    } catch (error) {
        console.error("Google Login Error:", error.message);
        alert(error.message);
    }
});

// ✅ Forgot Password Function
window.forgotPassword = async function () {
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
        alert("Please enter your email to reset password.");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent. Check your inbox.");
    } catch (error) {
        console.error("Password Reset Error:", error.message);
        alert(error.message);
    }
};

// ✅ Logout Function
window.logoutUser = async function () {
    try {
        await signOut(auth);
        alert("Logout successful!");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout Error:", error.message);
        alert(error.message);
    }
};
