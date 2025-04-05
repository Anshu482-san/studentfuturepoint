 // Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// ✅ Correct Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVWDO_LwXMN8TsJM76XApI6amIZ9TF55E",
    authDomain: "coaching-portal-4a385.firebaseapp.com",
    projectId: "coaching-portal-4a385",
    storageBucket: "coaching-portal-4a385.appspot.com",  // ✅ Fixed Storage URL
    messagingSenderId: "250759706104",
    appId: "1:250759706104:web:2378148b0be71d0baf920d",
    measurementId: "G-FMRCP0N7PK"
};

// ✅ Initialize Firebase Services
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Added Storage
