"use client"

import { getAuth, type Auth } from "firebase/auth"
import { initializeApp, getApps, getApp } from "firebase/app"

// Explicitly declare the auth export
export let auth: Auth | null = null

// Function to ensure Firebase app is initialized before getting auth
const ensureFirebaseApp = () => {
  // Skip on server
  if (typeof window === "undefined") return null

  try {
    // If Firebase is already initialized, return the app
    if (getApps().length > 0) {
      return getApp()
    }

    // Otherwise initialize Firebase
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    // Check if config is valid
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error("Firebase configuration is incomplete. Check your environment variables.")
      return null
    }

    return initializeApp(firebaseConfig)
  } catch (error) {
    console.error("Error ensuring Firebase app:", error)
    return null
  }
}

// Function to get auth with lazy initialization
export function getFirebaseAuth(): Auth | null {
  // Skip on server
  if (typeof window === "undefined") return null

  // Return existing auth if already initialized
  if (auth) return auth

  try {
    // Ensure Firebase app is initialized
    const app = ensureFirebaseApp()
    if (!app) {
      console.warn("Firebase app not initialized")
      return null
    }

    // Initialize auth
    auth = getAuth(app)
    return auth
  } catch (error) {
    console.error("Error initializing Firebase auth:", error)
    return null
  }
}

// Initialize auth on the client side
if (typeof window !== "undefined") {
  // Delay initialization to ensure Firebase SDK is fully loaded
  setTimeout(() => {
    try {
      getFirebaseAuth()
    } catch (error) {
      console.error("Error in delayed auth initialization:", error)
    }
  }, 1000)
}

