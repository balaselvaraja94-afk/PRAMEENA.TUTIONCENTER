import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQnWl_OAeJZH6Pyz45tFdIQONIXo6steM",
    authDomain: "tution-1881b.firebaseapp.com",
    projectId: "tution-1881b",
    storageBucket: "tution-1881b.firebasestorage.app",
    messagingSenderId: "842710800011",
    appId: "1:842710800011:web:a4e6eb4d8eb84009f3268e",
    measurementId: "G-8E8QN984W7"
};

// Initialize Firebase App, Auth, and Database
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get button elements
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// Registration Function
if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) return alert("Please fill both email and password.");

        try {
            // Check if any teachers exist
            const snapshot = await getDocs(collection(db, "teachers"));
            const isFirstUser = snapshot.empty;

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const role = isFirstUser ? "Master Admin" : "Teacher";
            const status = isFirstUser ? "Approved" : "Pending";

            await setDoc(doc(db, "teachers", user.uid), {
                email: user.email,
                role: role,
                status: status,
                createdAt: new Date().toISOString()
            });

            if (isFirstUser) {
                alert("Master Admin Account First-Time Setup Complete!");
                window.location.href = "teacherdashboard.html";
            } else {
                alert("Registration successful. Your account is pending Master Admin approval.");
                auth.signOut();
            }
        } catch (error) {
            alert("Registration Failed: " + error.message);
        }
    });
}

// Login Function
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) return alert("Please fill both email and password.");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "teachers", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.status === "Approved") {
                    window.location.href = "teacherdashboard.html";
                } else {
                    alert("Login Denied: Your account is awaiting Master Admin approval.");
                    auth.signOut();
                }
            } else {
                alert("Login Error: User record not found. Please register.");
                auth.signOut();
            }
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    });
}

console.log("Firebase Auth & Firestore Database connected");