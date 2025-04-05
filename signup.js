// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to Handle Signup
window.signupUser = async function () {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);
        alert("Signup successful! Check your email for verification.");

        // Save user role as 'student' in Firestore
        await setDoc(doc(db, "users", user.uid), { 
            role: "student", 
            email: user.email 
        });

        // Redirect to login page after signup
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (error) {
        console.error("Signup Error:", error.message);
        alert(error.message);
    }
};
