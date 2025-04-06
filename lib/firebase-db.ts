"use client"

import type { Firestore } from "firebase/firestore"
import { getFirebaseApp } from "./firebase"

// Explicitly declare the db export
export let db: Firestore | null = null

// Singleton pattern for Firestore instance
let dbInstance: Firestore | null = null
let dbInitializationPromise: Promise<Firestore | null> | null = null

// Function to get Firestore with lazy initialization
export async function getFirebaseFirestore(): Promise<Firestore | null> {
  // Skip on server
  if (typeof window === "undefined") return null

  // If we already have an initialization in progress, return that promise
  if (dbInitializationPromise) {
    return dbInitializationPromise
  }

  // If we already have an instance, return it
  if (dbInstance) {
    return dbInstance
  }

  // Create a new initialization promise
  dbInitializationPromise = (async () => {
    try {
      // Initialize Firebase app first
      const app = getFirebaseApp()
      if (!app) {
        console.warn("Firebase app not initialized yet")
        return null
      }

      // Wait for Firebase to be fully loaded before getting Firestore
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Dynamically import Firestore to ensure it's only loaded on the client side
      const { getFirestore } = await import("firebase/firestore")

      // Initialize Firestore with the app
      dbInstance = getFirestore(app)

      // Update the exported db variable
      db = dbInstance

      return dbInstance
    } catch (error) {
      console.error("Error initializing Firebase Firestore:", error)
      return null
    } finally {
      // Clear the promise reference once done
      dbInitializationPromise = null
    }
  })()

  return dbInitializationPromise
}

// Initialize db on the client side with retry mechanism
if (typeof window !== "undefined") {
  const initDb = async (retryCount = 0, maxRetries = 3) => {
    try {
      const result = await getFirebaseFirestore()
      if (!result && retryCount < maxRetries) {
        // Exponential backoff for retries
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
        console.log(`Firestore initialization attempt ${retryCount + 1} failed, retrying in ${delay}ms...`)
        setTimeout(() => initDb(retryCount + 1, maxRetries), delay)
      }
    } catch (error) {
      console.error("Error in Firestore initialization:", error)
      if (retryCount < maxRetries) {
        // Exponential backoff for retries
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
        console.log(`Firestore initialization error, retrying in ${delay}ms...`)
        setTimeout(() => initDb(retryCount + 1, maxRetries), delay)
      }
    }
  }

  // Start initialization with a slight delay to ensure Firebase core is loaded first
  setTimeout(() => initDb(), 500)
}

