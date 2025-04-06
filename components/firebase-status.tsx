"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import Image from "next/image"

export function FirebaseStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "not-configured">("loading")
  const [message, setMessage] = useState("Checking Firebase status...")
  const [details, setDetails] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkFirebase = async () => {
    setIsChecking(true)
    setStatus("loading")
    setMessage("Checking Firebase status...")

    try {
      // Check if Firebase config exists
      const hasConfig =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

      if (!hasConfig) {
        setStatus("not-configured")
        setMessage("Firebase is not configured")
        setDetails("Please set up your Firebase configuration")
        setIsChecking(false)
        return
      }

      // Try to initialize Firebase
      const { initializeApp, getApps } = await import("firebase/app")

      // Check if Firebase is already initialized
      if (getApps().length > 0) {
        setStatus("success")
        setMessage("Firebase is already initialized")
        setDetails("Your Firebase configuration is working correctly")
        setIsChecking(false)
        return
      }

      // Initialize Firebase
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }

      const app = initializeApp(firebaseConfig)

      // Try to get auth
      const { getAuth } = await import("firebase/auth")
      const auth = getAuth(app)

      // Try to get Firestore
      const { getFirestore } = await import("firebase/firestore")
      const db = getFirestore(app)

      setStatus("success")
      setMessage("Firebase is properly initialized")
      setDetails(`Auth: ${auth ? "Available" : "Not available"}, Firestore: ${db ? "Available" : "Not available"}`)
    } catch (error) {
      setStatus("error")
      setMessage("Error checking Firebase status")
      setDetails(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Add a delay to ensure client-side execution
    const timer = setTimeout(() => {
      checkFirebase()
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      <Alert
        className={
          status === "success"
            ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
            : status === "error"
              ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
              : status === "not-configured"
                ? "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
        }
      >
        {status === "success" ? (
          <CheckCircle className="h-4 w-4" />
        ) : status === "loading" ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <div>
          <AlertTitle>{message}</AlertTitle>
          {details && <AlertDescription>{details}</AlertDescription>}
        </div>
      </Alert>

      {status === "success" && (
        <div className="flex justify-center">
          <Image src="/images/setup-success.png" alt="Firebase Success" width={100} height={100} />
        </div>
      )}

      {status === "not-configured" && (
        <div className="flex justify-center">
          <Image
            src="/images/firebase-setup-guide.png"
            alt="Firebase Setup Guide"
            width={200}
            height={150}
            className="rounded-lg opacity-80"
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={checkFirebase}
          disabled={isChecking}
          className="flex items-center gap-1"
        >
          {isChecking && <RefreshCw className="h-3 w-3 animate-spin" />}
          {isChecking ? "Checking..." : "Refresh Status"}
        </Button>
      </div>
    </div>
  )
}

