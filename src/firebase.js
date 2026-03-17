// ══════════════════════════════════════════════
// FIREBASE CONFIG — Transtriatlon
// ══════════════════════════════════════════════
// INSTRUCCIONES: Reemplaza los valores de abajo
// con los de tu proyecto de Firebase.
// ══════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8ymR9hKx_3VtQErge0GYgxD712QepQCg",
  authDomain: "transtriatlon-793fb.firebaseapp.com",
  projectId: "transtriatlon-793fb",
  storageBucket: "transtriatlon-793fb.firebasestorage.app",
  messagingSenderId: "482250978345",
  appId: "1:482250978345:web:b0742bb9d69223c966d838",
  measurementId: "G-XMHFK4Z2KH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
