import { auth, db } from "./firebaseConfig.js";
import { 
    onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { 
    doc, getDoc, updateDoc, collection, getDocs, addDoc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ✅ Logout function
async function logoutUser() {
    try {
        await signOut(auth);
        alert("Logout successful!");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout Error:", error.message);
        alert(error.message);
    }
}
window.logoutUser = logoutUser;

// ✅ Fetch & Display All Students
async function fetchStudents() {
    const studentList = document.getElementById("studentList");
    const feeDropdown = document.getElementById("feeStudentSelect");
    const notificationDropdown = document.getElementById("notificationStudentSelect");

    studentList.innerHTML = ""; 
    feeDropdown.innerHTML = `<option value="">Select Student</option>`;
    notificationDropdown.innerHTML = `<option value="all">Send to All</option>`;

    try {
        const usersSnapshot = await getDocs(collection(db, "users")); 
        usersSnapshot.forEach((docData) => {
            const student = docData.data();
            if (student.role === "student") {
                const listItem = document.createElement("li");
                listItem.textContent = `${student.name || "Unknown"} - ${student.email}`;
                studentList.appendChild(listItem);

                const feeOption = document.createElement("option");
                feeOption.value = docData.id;
                feeOption.textContent = `${student.name || student.email}`;
                feeDropdown.appendChild(feeOption);

                const notifOption = document.createElement("option");
                notifOption.value = docData.id;
                notifOption.textContent = `${student.name || student.email}`;
                notificationDropdown.appendChild(notifOption);
            }
        });
    } catch (error) {
        console.error("Error fetching students:", error.message);
    }
}

// ✅ Update Fees
async function updateFees() {
    const studentUID = document.getElementById("feeStudentSelect").value;
    const month = document.getElementById("feeMonth").value;
    const amount = document.getElementById("feeAmount").value;
    const status = document.getElementById("feeStatus").value;

    if (!studentUID || !month || !amount) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const studentRef = doc(db, "users", studentUID);
        await updateDoc(studentRef, {
            [`fees.${month}`]: { amount, status }
        });

        alert("Fees updated!");
    } catch (error) {
        console.error("Error updating fees:", error.message);
        alert(error.message);
    }
}
window.updateFees = updateFees;

// ✅ Send Notification to Student(s)
async function sendNotification() {
    const studentUID = document.getElementById("notificationStudentSelect").value;
    const message = document.getElementById("notificationMessage").value;

    if (!message) {
        alert("Please enter a notification message.");
        return;
    }

    try {
        if (studentUID === "all") {
            // Send notification to all students
            const usersSnapshot = await getDocs(collection(db, "users"));
            usersSnapshot.forEach(async (userDoc) => {
                const userRef = doc(db, "users", userDoc.id);
                await updateDoc(userRef, {
                    notifications: userDoc.data().notifications
                        ? [...userDoc.data().notifications, { message, timestamp: new Date() }]
                        : [{ message, timestamp: new Date() }]
                });
            });
        } else {
            // Send notification to a specific student
            const userRef = doc(db, "users", studentUID);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                await updateDoc(userRef, {
                    notifications: userSnap.data().notifications
                        ? [...userSnap.data().notifications, { message, timestamp: new Date() }]
                        : [{ message, timestamp: new Date() }]
                });
            }
        }

        alert("Notification sent successfully!");
        document.getElementById("notificationMessage").value = "";
    } catch (error) {
        console.error("Error sending notification:", error.message);
        alert("Error sending notification. Check the console.");
    }
}
window.sendNotification = sendNotification;

// ✅ Update Notice
async function updateNotice() {
    const noticeText = document.getElementById("noticeText").value;
    
    if (!noticeText) {
        alert("Please enter a notice.");
        return;
    }

    try {
        await addDoc(collection(db, "notices"), {
            text: noticeText,
            timestamp: new Date()
        });

        alert("Notice updated successfully!");
        fetchNotices();
    } catch (error) {
        console.error("Error updating notice:", error);
        alert("Error updating notice. Check the console.");
    }
}
window.updateNotice = updateNotice;

// ✅ Fetch Notices Date-wise
async function fetchNotices() {
    const noticeList = document.getElementById("noticeList");
    noticeList.innerHTML = "";

    try {
        const q = query(collection(db, "notices"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            const noticeData = doc.data();
            const noticeItem = document.createElement("li");
            noticeItem.textContent = `${new Date(noticeData.timestamp.toDate()).toLocaleDateString()} - ${noticeData.text}`;
            noticeList.appendChild(noticeItem);
        });
    } catch (error) {
        console.error("Error fetching notices:", error);
    }
}

// ✅ Fetch Data When Admin Logs In
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchStudents();
        fetchNotices();
    }
});
