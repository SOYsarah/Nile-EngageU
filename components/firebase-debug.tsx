"use client"

import { useEffect, useState } from "react"

export function FirebaseDebug() {
  const [status, setStatus] = useState("Checking Firebase status...")
  const [config, setConfig] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    // Display environment variables (without exposing sensitive values)
    setConfig({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✓ Set" : "✗ Missing",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✓ Set" : "✗ Missing",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✓ Set" : "✗ Missing",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing",
    })

    const testFirebase = async () => {
      try {
        setStatus("Importing Firebase...")
        const { getApps, initializeApp } = await import("firebase/app")

        setStatus("Checking existing Firebase instances...")
        if (getApps().length > 0) {
          setStatus("Firebase already initialized!")
          return
        }

        setStatus("Setting up config...")
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }

        setStatus("Initializing Firebase app...")
        const app = initializeApp(firebaseConfig)

        setStatus("Testing Auth service...")
        const { getAuth } = await import("firebase/auth")
        const auth = getAuth(app)

        setStatus("Testing Firestore service...")
        const { getFirestore } = await import("firebase/firestore")
        const db = getFirestore(app)

        setStatus("Firebase initialized and services available! ✅")
      } catch (err) {
        console.error("Firebase initialization error:", err)
        setStatus(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="p-6 bg-muted rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Firebase Integration Test</h2>

      <div className="space-y-2">
        <h3 className="font-semibold">Environment Variables:</h3>
        <ul className="space-y-1">
          {Object.entries(config).map(([key, value]) => (
            <li key={key} className={value === "✓ Set" ? "text-green-600" : "text-red-600"}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Initialization Status:</h3>
        <p
          className={
            status.includes("Error") ? "text-red-600" : status.includes("✅") ? "text-green-600" : "text-amber-600"
          }
        >
          {status}
        </p>
      </div>
    </div>
  )
}

