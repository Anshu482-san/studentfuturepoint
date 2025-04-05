import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs, doc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
document.getElementById("logoutBtn").addEventListener("click", logoutUser);

// ✅ Fetch Notices (Date-wise)
async function fetchNotices() {
    try {
        const noticeList = document.getElementById("noticeList");
        noticeList.innerHTML = ""; 

        const q = query(collection(db, "notices"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const noticeData = doc.data();
                const noticeItem = document.createElement("li");
                noticeItem.textContent = `${new Date(noticeData.timestamp.toDate()).toLocaleDateString()} - ${noticeData.text}`;
                noticeList.appendChild(noticeItem);
            });
        } else {
            noticeList.innerHTML = "<li>No notices available</li>";
        }
    } catch (error) {
        console.error("Error fetching notices:", error);
    }
}

 // ✅ Fetch Notifications (Fixed)
async function fetchNotifications(userUID) {
    try {
        const userRef = doc(db, "users", userUID);
        const userSnap = await getDoc(userRef);
        const notificationList = document.getElementById("notificationList");
        notificationList.innerHTML = "";

        if (userSnap.exists()) {
            const notifications = userSnap.data().notifications || [];

            if (notifications.length === 0) {
                notificationList.innerHTML = "<li>No notifications available.</li>";
            } else {
                // Sorting notifications by timestamp (latest first)
                notifications.sort((a, b) => {
                    const timeA = a.timestamp ? a.timestamp.toDate() : new Date(0);
                    const timeB = b.timestamp ? b.timestamp.toDate() : new Date(0);
                    return timeB - timeA;
                });

                notifications.forEach((notif) => {
                    const notifItem = document.createElement("li");
                    const notifTime = notif.timestamp ? new Date(notif.timestamp.toDate()).toLocaleString() : "Unknown Date";
                    notifItem.textContent = `${notifTime} - ${notif.message || "No message available"}`;
                    notificationList.appendChild(notifItem);
                });
            }
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}


// ✅ Fetch Fee Status (Months Now Ordered Correctly)
async function fetchFees(userUID) {
    try {
        const userRef = doc(db, "users", userUID);
        const userSnap = await getDoc(userRef);
        const feeTable = document.getElementById("feeTable");
        feeTable.innerHTML = "";

        if (userSnap.exists()) {
            const fees = userSnap.data().fees || {};

            // Month order (fixed order from Jan to Dec)
            const monthOrder = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            // Sorting months properly
            const sortedFees = Object.keys(fees).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

            sortedFees.forEach((month) => {
                const feeRow = document.createElement("tr");
                feeRow.innerHTML = `
                    <td>${month}</td>
                    <td>${fees[month].amount} - ${fees[month].status}</td>
                `;
                feeTable.appendChild(feeRow);
            });
        }
    } catch (error) {
        console.error("Error fetching fees:", error);
    }
}

// ✅ Fetch Data When User Logs In
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchNotices();
        fetchNotifications(user.uid);
        fetchFees(user.uid);
    }
});
