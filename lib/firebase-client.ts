"use client"

// This file provides a centralized way to initialize and access Firebase services
// with proper error handling and sequencing to avoid "Component not registered" errors

import { useState, useEffect } from "react"

// Define types for our Firebase services
type FirebaseApp = any
type FirebaseAuth = any
type FirebaseFirestore = any

// Define the return type for our hook
interface FirebaseServices {
  app: FirebaseApp | null
  auth: FirebaseAuth | null
  db: FirebaseFirestore | null
  initialized: boolean
  error: Error | null
}

// Global variables to store Firebase instances
let _app: FirebaseApp | null = null
let _auth: FirebaseAuth | null = null
let _db: FirebaseFirestore | null = null
let _initialized = false
let _initializing = false
let _initializationPromise: Promise<FirebaseServices> | null = null

// Function to initialize Firebase and its services
async function initializeFirebaseServices(): Promise<FirebaseServices> {
  // Skip on server side
  if (typeof window === "undefined") {
    return { app: null, auth: null, db: null, initialized: false, error: null }
  }

  // If already initialized, return the instances
  if (_initialized && _app && _auth && _db) {
    return { app: _app, auth: _auth, db: _db, initialized: true, error: null }
  }

  // If initialization is in progress, return the promise
  if (_initializing && _initializationPromise) {
    return _initializationPromise
  }

  // Set initializing flag
  _initializing = true

  // Create a new initialization promise
  _initializationPromise = (async () => {
    try {
      console.log("Starting Firebase initialization sequence...")

      // Step 1: Dynamically import Firebase app
      console.log("Step 1: Importing Firebase app...")
      const { initializeApp, getApps, getApp } = await import("firebase/app")

      // Step 2: Check if Firebase is already initialized
      let app: FirebaseApp
      if (getApps().length > 0) {
        console.log("Firebase app already initialized, getting instance...")
        app = getApp()
      } else {
        // Step 3: Initialize Firebase app
        console.log("Initializing new Firebase app...")
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }

        // Validate config
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
          throw new Error("Firebase configuration is incomplete. Check your environment variables.")
        }

        app = initializeApp(firebaseConfig)
      }

      // Store app instance
      _app = app

      // Step 4: Add a delay to ensure Firebase core is fully loaded
      console.log("Waiting for Firebase core to fully initialize...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 5: Initialize Firebase Auth
      console.log("Step 5: Initializing Firebase Auth...")
      const { getAuth } = await import("firebase/auth")
      const auth = getAuth(app)
      _auth = auth

      // Step 6: Add another delay before initializing Firestore
      console.log("Waiting before initializing Firestore...")
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 7: Initialize Firestore
      console.log("Step 7: Initializing Firestore...")
      const { getFirestore } = await import("firebase/firestore")
      const db = getFirestore(app)
      _db = db

      // Set initialized flag
      _initialized = true
      console.log("Firebase initialization complete!")

      return { app, auth, db, initialized: true, error: null }
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      return {
        app: null,
        auth: null,
        db: null,
        initialized: false,
        error: error instanceof Error ? error : new Error("Unknown error initializing Firebase"),
      }
    } finally {
      _initializing = false
      _initializationPromise = null
    }
  })()

  return _initializationPromise
}

// Hook to use Firebase services
export function useFirebase(): FirebaseServices & { initializing: boolean } {
  const [services, setServices] = useState<FirebaseServices & { initializing: boolean }>({
    app: null,
    auth: null,
    db: null,
    initialized: false,
    initializing: true,
    error: null,
  })

  useEffect(() => {
    // Skip on server side
    if (typeof window === "undefined") return

    let isMounted = true

    const initializeServices = async () => {
      try {
        const result = await initializeFirebaseServices()

        if (isMounted) {
          setServices({
            ...result,
            initializing: false,
          })
        }
      } catch (error) {
        console.error("Error in useFirebase hook:", error)

        if (isMounted) {
          setServices({
            app: null,
            auth: null,
            db: null,
            initialized: false,
            initializing: false,
            error: error instanceof Error ? error : new Error("Unknown error in useFirebase hook"),
          })
        }
      }
    }

    initializeServices()

    return () => {
      isMounted = false
    }
  }, [])

  return services
}

// Export a function to get Firebase services without using a hook
export async function getFirebaseServices(): Promise<FirebaseServices> {
  return initializeFirebaseServices()
}

// Initialize Firebase on the client side
if (typeof window !== "undefined") {
  // Delay initialization to ensure the page is fully loaded
  setTimeout(() => {
    initializeFirebaseServices().then(({ initialized, error }) => {
      if (initialized) {
        console.log("Firebase initialized successfully via auto-init")
      } else if (error) {
        console.error("Failed to auto-initialize Firebase:", error)
      }
    })
  }, 2000)
}

// Export the global instances for direct access
// Note: These might be null initially
export const app = () => _app
export const auth = () => _auth
export const db = () => _db
export const isInitialized = () => _initialized

