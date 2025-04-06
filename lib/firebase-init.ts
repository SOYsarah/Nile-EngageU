"use client"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"

// Singleton instances
let firebaseApp: FirebaseApp | undefined
let firebaseAuth: Auth | undefined
let firebaseDb: Firestore | undefined
let isInitializing = false
let initializationPromise: Promise<{
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
}> | null = null

/**
 * Initialize or get the Firebase app instance
 */
export function initializeFirebase(): FirebaseApp | null {
  if (typeof window === "undefined") {
    // Skip on server side
    return null
  }

  // Return existing app if available
  if (firebaseApp) {
    return firebaseApp
  }

  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    firebaseApp = getApp()
    return firebaseApp
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
    firebaseApp = initializeApp(firebaseConfig)
    return firebaseApp
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    return null
  }
}

/**
 * Get the Firebase Auth instance with lazy loading
 */
export async function getFirebaseAuth(): Promise<Auth | null> {
  if (typeof window === "undefined") {
    // Skip on server side
    return null
  }

  // Return existing auth if already initialized
  if (firebaseAuth) {
    return firebaseAuth
  }

  try {
    // Initialize Firebase app first
    const app = initializeFirebase()
    if (!app) {
      return null
    }

    // Add a small delay to ensure Firebase is fully initialized
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Dynamically import Firebase Auth to ensure it's only loaded on the client side
    const { getAuth } = await import("firebase/auth")
    firebaseAuth = getAuth(app)
    return firebaseAuth
  } catch (error) {
    console.error("Error initializing Firebase Auth:", error)
    return null
  }
}

/**
 * Get the Firebase Firestore instance with lazy loading
 */
export async function getFirebaseDb(): Promise<Firestore | null> {
  if (typeof window === "undefined") {
    // Skip on server side
    return null
  }

  // Return existing db if already initialized
  if (firebaseDb) {
    return firebaseDb
  }

  try {
    // Initialize Firebase app first
    const app = initializeFirebase()
    if (!app) {
      return null
    }

    // Add a small delay to ensure Firebase is fully initialized
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Dynamically import Firestore to ensure it's only loaded on the client side
    const { getFirestore } = await import("firebase/firestore")
    firebaseDb = getFirestore(app)
    return firebaseDb
  } catch (error) {
    console.error("Error initializing Firebase Firestore:", error)
    return null
  }
}

/**
 * Initialize all Firebase services with retry mechanism
 */
export async function initializeAllFirebaseServices(
  maxRetries = 3,
  retryDelay = 1000,
): Promise<{
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
}> {
  if (typeof window === "undefined") {
    // Skip on server side
    return { app: null, auth: null, db: null }
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

    return {
      app: firebaseApp || null,
      auth: firebaseAuth || null,
      db: firebaseDb || null,
    }
  }

  isInitializing = true

  // Create a new initialization promise
  initializationPromise = (async () => {
    try {
      // Initialize Firebase app
      const app = initializeFirebase()
      if (!app) {
        return { app: null, auth: null, db: null }
      }

      // Add a small delay to ensure Firebase core is fully initialized
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Initialize Firebase Auth with retry
      let auth = null
      let authRetries = 0
      while (!auth && authRetries < maxRetries) {
        try {
          // Dynamically import Firebase Auth
          const { getAuth } = await import("firebase/auth")
          auth = getAuth(app)
          firebaseAuth = auth
        } catch (error) {
          console.warn(`Auth initialization attempt ${authRetries + 1} failed:`, error)
          authRetries++
          if (authRetries < maxRetries) {
            // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, authRetries)))
          }
        }
      }

      // Add another small delay before initializing Firestore
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Initialize Firestore with retry
      let db = null
      let dbRetries = 0
      while (!db && dbRetries < maxRetries) {
        try {
          // Dynamically import Firestore
          const { getFirestore } = await import("firebase/firestore")
          db = getFirestore(app)
          firebaseDb = db
        } catch (error) {
          console.warn(`Firestore initialization attempt ${dbRetries + 1} failed:`, error)
          dbRetries++
          if (dbRetries < maxRetries) {
            // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, dbRetries)))
          }
        }
      }

      return { app, auth, db }
    } finally {
      isInitializing = false
      initializationPromise = null
    }
  })()

  return initializationPromise
}

/**
 * Force re-initialization of Firebase with new config
 */
export async function reinitializeFirebase(config: {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}): Promise<{
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
}> {
  if (typeof window === "undefined") {
    return { app: null, auth: null, db: null }
  }

  try {
    // Import dynamically to avoid SSR issues
    const { deleteApp } = await import("firebase/app")

    // Delete existing apps
    const apps = getApps()
    for (const app of apps) {
      await deleteApp(app)
    }

    // Reset singletons
    firebaseApp = undefined
    firebaseAuth = undefined
    firebaseDb = undefined

    // Initialize with new config
    firebaseApp = initializeApp(config)

    // Add a delay to ensure Firebase core is fully initialized
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Initialize services
    let auth = null
    let db = null

    try {
      // Initialize Auth
      const { getAuth } = await import("firebase/auth")
      auth = getAuth(firebaseApp)
      firebaseAuth = auth
    } catch (error) {
      console.error("Error initializing Auth during reinitialization:", error)
    }

    // Add a small delay before initializing Firestore
    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      // Initialize Firestore
      const { getFirestore } = await import("firebase/firestore")
      db = getFirestore(firebaseApp)
      firebaseDb = db
    } catch (error) {
      console.error("Error initializing Firestore during reinitialization:", error)
    }

    return { app: firebaseApp, auth, db }
  } catch (error) {
    console.error("Error reinitializing Firebase:", error)
    return { app: null, auth: null, db: null }
  }
}

/**
 * Check if Firebase is properly initialized
 */
export function isFirebaseInitialized(): boolean {
  return getApps().length > 0
}

