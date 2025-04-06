"use client"

import type React from "react"

import { useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onIdTokenChanged } from "firebase/auth"

// This component handles setting the session cookie when the Firebase auth state changes
export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined" || !auth) return

    return onIdTokenChanged(auth, async (user) => {
      if (user) {
        // User is signed in, get the ID token
        const token = await user.getIdToken()

        // Send the token to the server to create a session
        try {
          await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: token }),
          })
        } catch (error) {
          console.error("Error setting session:", error)
        }
      } else {
        // User is signed out, clear the session
        try {
          await fetch("/api/auth/session", {
            method: "DELETE",
          })
        } catch (error) {
          console.error("Error clearing session:", error)
        }
      }
    })
  }, [])

  return <>{children}</>
}

