  // ✅ Import Firebase Modules
import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ✅ Function to Handle Signup
window.signupUser = async function () {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!email || !password) {
        alert("⚠️ Please fill in all fields.");
        return;
    }

    try {
        // ✅ Create User with Email & Password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Send Email Verification
        await sendEmailVerification(user);
        alert("✅ Signup successful! Please check your email for verification.");

        // ✅ Check if user already exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // ✅ Save user role as 'student' in Firestore
            await setDoc(userRef, { 
                role: "student", 
                email: user.email, 
                verified: false  // Store verification status
            });
        }

        // ✅ Redirect to Login Page after 2 seconds
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (error) {
        console.error("❌ Signup Error:", error.message);

        // ✅ Handle Firebase Errors Properly
        if (error.code === "auth/email-already-in-use") {
            alert("⚠️ This email is already registered.");
        } else if (error.code === "auth/weak-password") {
            alert("⚠️ Password should be at least 6 characters long.");
        } else {
            alert("⚠️ Error: " + error.message);
        }
    }
};
