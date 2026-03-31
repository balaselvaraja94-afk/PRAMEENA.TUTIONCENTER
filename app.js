import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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

// Login Function
loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // alert("Successful Login! Welcome " + userCredential.user.email);
            window.location.href = "teacherdashboard.html";
        })
        .catch((error) => {
            // Master Admin Auto-Setup Hack: If the canva account doesn't exist yet, build it magically upon first login!
            if ((error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') && email === "canvaonly322@gmail.com") {
                createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userCredential) => {
                        const user = userCredential.user;
                        await setDoc(doc(db, "teachers", user.uid), {
                            email: user.email,
                            role: "Master Admin",
                            createdAt: new Date().toISOString()
                        });
                        alert("Master Admin Account First-Time Setup Complete!");
                        window.location.href = "teacherdashboard.html";
                    })
                    .catch((err) => alert("Admin Setup Failed! " + err.message));
            } else {
                alert("Login Failed: " + error.message);
            }
        });
});

console.log("Firebase Auth & Firestore Database connected");