"use client"

import { useState, useEffect } from "react"
import { initializeAllFirebaseServices } from "@/lib/firebase-init"
import type { FirebaseApp } from "firebase/app"
import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"

interface UseFirebaseResult {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  initialized: boolean
  initializing: boolean
  error: Error | null
}

export function useFirebase(): UseFirebaseResult {
  const [result, setResult] = useState<UseFirebaseResult>({
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
    let retryCount = 0
    const maxRetries = 3

    const initFirebase = async () => {
      try {
        // Initialize all Firebase services
        const { app, auth, db } = await initializeAllFirebaseServices()

        if (isMounted) {
          setResult({
            app,
            auth,
            db,
            initialized: !!app && !!auth && !!db,
            initializing: false,
            error: null,
          })
        }
      } catch (error) {
        console.error("Error initializing Firebase:", error)

        if (isMounted) {
          // If we haven't reached max retries, try again
          if (retryCount < maxRetries) {
            retryCount++
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
            console.log(`Firebase initialization failed, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`)

            setTimeout(initFirebase, delay)
          } else {
            setResult((prev) => ({
              ...prev,
              initializing: false,
              error: error instanceof Error ? error : new Error("Unknown error initializing Firebase"),
            }))
          }
        }
      }
    }

    // Add a small delay before first initialization attempt
    setTimeout(initFirebase, 300)

    return () => {
      isMounted = false
    }
  }, [])

  return result
}

