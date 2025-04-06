"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// This file provides a simple way to initialize Firebase and its services
// with proper error handling and retry logic

// Initialize Firebase with retry mechanism
export async function initializeFirebase(retryCount = 0, maxRetries = 3) {
  try {
    // If Firebase is already initialized, return the app
    if (getApps().length > 0) {
      const app = getApp()
      const auth = getAuth(app)
      const db = getFirestore(app)
      return { app, auth, db }
    }

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
      return { app: null, auth: null, db: null }
    }

    // Initialize Firebase
    console.log("Initializing Firebase app...")
    const app = initializeApp(firebaseConfig)

    // Add a small delay to ensure Firebase is fully initialized
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Initialize services
    const auth = getAuth(app)
    const db = getFirestore(app)

    return { app, auth, db }
  } catch (error) {
    console.error(`Error initializing Firebase (attempt ${retryCount + 1}/${maxRetries}):`, error)

    // Retry with exponential backoff
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
      console.log(`Retrying in ${delay}ms...`)

      await new Promise((resolve) => setTimeout(resolve, delay))
      return initializeFirebase(retryCount + 1, maxRetries)
    }

    return { app: null, auth: null, db: null }
  }
}

// Initialize Firebase on the client side
if (typeof window !== "undefined") {
  // Delay initialization to ensure the page is fully loaded
  setTimeout(() => {
    initializeFirebase().then(({ app, auth, db }) => {
      if (app && auth && db) {
        console.log("Firebase initialized successfully")
      } else {
        console.error("Failed to initialize Firebase")
      }
    })
  }, 1000)
}

