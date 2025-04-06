"use client"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"

// Initialize Firebase only on the client side
let firebaseAppInstance: FirebaseApp | null = null

/**
 * Initialize or get the Firebase app instance
 */
export function getFirebaseApp(): FirebaseApp | null {
  // Skip on server
  if (typeof window === "undefined") return null

  // Return existing app if already initialized
  if (firebaseAppInstance) {
    return firebaseAppInstance
  }

  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    firebaseAppInstance = getApp()
    return firebaseAppInstance
  }

  try {
    // Get config from environment variables
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

    // Initialize Firebase
    console.log("Initializing Firebase app...")
    firebaseAppInstance = initializeApp(firebaseConfig)
    return firebaseAppInstance
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    return null
  }
}

// Export the Firebase app instance
export const firebaseApp = getFirebaseApp()

// Export a function to check if Firebase is initialized
export const isFirebaseInitialized = () => {
  if (typeof window === "undefined") return false
  return getApps().length > 0
}

// Explicitly declare exports for auth and db
export const auth = null
export const db = null

