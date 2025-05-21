// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
 apiKey: "AIzaSyA1tJ7ScZ5BTHKjQFZA6sKuWwzIg0qEl24",
  authDomain: "kakeibo-app-70d1c.firebaseapp.com",
  projectId: "kakeibo-app-70d1c",
  storageBucket: "kakeibo-app-70d1c.firebasestorage.app",
  messagingSenderId: "64023220042",
  appId: "1:64023220042:web:1a724076ed9471a1a67bb3",
  measurementId: "G-6C5VE3LC7V"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
