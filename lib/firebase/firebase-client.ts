"use client"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import { enableIndexedDbPersistence } from "firebase/firestore"

// Define types for our Firebase services
interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  analytics: Analytics | null
  storage: FirebaseStorage
}

// Singleton instances
let firebaseApp: FirebaseApp | undefined
let firebaseAuth: Auth | undefined
let firebaseDb: Firestore | undefined
let firebaseAnalytics: Analytics | undefined
let firebaseStorage: FirebaseStorage | undefined
let isInitializing = false
let initializationPromise: Promise<FirebaseServices | null> | null = null
let offlineEnabled = false

/**
 * Initialize all Firebase services with proper sequencing and error handling
 */
export async function initializeFirebase(): Promise<FirebaseServices | null> {
  // Skip on server side
  if (typeof window === "undefined") {
    return null
  }

  // Return existing promise if initialization is already in progress
  if (initializationPromise) {
    return initializationPromise
  }

  // Prevent multiple simultaneous initialization attempts
  if (isInitializing) {
    // Wait for initialization to complete
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!isInitializing) {
          clearInterval(checkInterval)
          resolve(true)
        }
      }, 100)
    })

    if (firebaseApp && firebaseAuth && firebaseDb) {
      return {
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDb,
        analytics: firebaseAnalytics || null,
        storage: firebaseStorage!,
      }
    }
  }

  isInitializing = true

  // Create a new initialization promise
  initializationPromise = (async () => {
    try {
      console.log("Starting Firebase initialization sequence...")

      // Step 1: Initialize Firebase app
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      }

      // Validate config
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error("Firebase configuration is incomplete. Check your environment variables.")
      }

      // Initialize Firebase app
      firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
      console.log("Firebase app initialized successfully")

      // Step 2: Initialize Firebase Auth
      firebaseAuth = getAuth(firebaseApp)
      console.log("Firebase Auth initialized successfully")

      // Step 3: Initialize Firestore
      firebaseDb = getFirestore(firebaseApp)
      console.log("Firestore initialized successfully")

      // Step 4: Initialize Firebase Storage
      firebaseStorage = getStorage(firebaseApp)
      console.log("Firebase Storage initialized successfully")

      // Step 5: Initialize Analytics if supported
      try {
        if (await isSupported()) {
          firebaseAnalytics = getAnalytics(firebaseApp)
          console.log("Firebase Analytics initialized successfully")
        } else {
          console.log("Firebase Analytics not supported in this environment")
        }
      } catch (error) {
        console.warn("Failed to initialize Firebase Analytics:", error)
      }

      // Step 6: Enable offline persistence for Firestore
      if (firebaseDb && !offlineEnabled) {
        try {
          await enableIndexedDbPersistence(firebaseDb)
          offlineEnabled = true
          console.log("Firestore offline persistence enabled")
        } catch (error) {
          console.warn("Failed to enable offline persistence:", error)
        }
      }

      return {
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDb,
        analytics: firebaseAnalytics || null,
        storage: firebaseStorage,
      }
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      return null
    } finally {
      isInitializing = false
      initializationPromise = null
    }
  })()

  return initializationPromise
}

// Export functions to get individual services
export async function getFirebaseApp(): Promise<FirebaseApp | null> {
  const services = await initializeFirebase()
  return services?.app || null
}

export async function getFirebaseAuth(): Promise<Auth | null> {
  const services = await initializeFirebase()
  return services?.auth || null
}

export async function getFirebaseDb(): Promise<Firestore | null> {
  const services = await initializeFirebase()
  return services?.db || null
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  const services = await initializeFirebase()
  return services?.analytics || null
}

export async function getFirebaseStorage(): Promise<FirebaseStorage | null> {
  const services = await initializeFirebase()
  return services?.storage || null
}

// Initialize Firebase on the client side with retry mechanism
if (typeof window !== "undefined") {
  const initWithRetry = async (retryCount = 0, maxRetries = 3) => {
    try {
      await initializeFirebase()
    } catch (error) {
      console.error(`Firebase initialization error (attempt ${retryCount + 1}/${maxRetries}):`, error)
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
        console.log(`Retrying in ${delay}ms...`)
        setTimeout(() => initWithRetry(retryCount + 1, maxRetries), delay)
      }
    }
  }

  // Start initialization with a slight delay to ensure the page is fully loaded
  setTimeout(() => initWithRetry(), 1000)
}

