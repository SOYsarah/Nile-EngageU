"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { reinitializeFirebase, isFirebaseInitialized } from "@/lib/firebase-init"
import Image from "next/image"

export function FirebaseReinitialize() {
  // State for Firebase config
  const [apiKey, setApiKey] = useState("")
  const [authDomain, setAuthDomain] = useState("")
  const [projectId, setProjectId] = useState("")
  const [storageBucket, setStorageBucket] = useState("")
  const [messagingSenderId, setMessagingSenderId] = useState("")
  const [appId, setAppId] = useState("")

  // Status states
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [currentConfig, setCurrentConfig] = useState<any>(null)

  // Load existing config on mount
  useEffect(() => {
    // Skip on server side
    if (typeof window === "undefined") return

    // Check for config in localStorage first (for development convenience)
    const savedConfig = localStorage.getItem("firebaseConfig")
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setApiKey(config.apiKey || "")
        setAuthDomain(config.authDomain || "")
        setProjectId(config.projectId || "")
        setStorageBucket(config.storageBucket || "")
        setMessagingSenderId(config.messagingSenderId || "")
        setAppId(config.appId || "")
      } catch (error) {
        console.error("Error parsing saved config:", error)
      }
    }

    // Also check environment variables
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setApiKey(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
    }
    if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
      setAuthDomain(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
    }
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      setProjectId(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    }
    if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
      setStorageBucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    }
    if (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
      setMessagingSenderId(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
    }
    if (process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
      setAppId(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
    }

    // Check current Firebase initialization status
    checkCurrentConfig()
  }, [])

  // Check current Firebase config
  const checkCurrentConfig = async () => {
    try {
      // Check if Firebase is initialized
      const initialized = isFirebaseInitialized()

      if (initialized) {
        // Get the current app
        const { getApp } = await import("firebase/app")
        const app = getApp()

        setCurrentConfig({
          initialized: true,
          appName: app.name,
          options: app.options,
        })
      } else {
        setCurrentConfig({
          initialized: false,
          appCount: 0,
        })
      }
    } catch (error) {
      console.error("Error checking Firebase config:", error)
      setCurrentConfig({
        initialized: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Initialize or re-initialize Firebase
  const handleInitialize = async () => {
    setStatus("loading")
    setMessage("Initializing Firebase...")

    try {
      // Create config object
      const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
      }

      // Reinitialize Firebase with new config
      const { app, auth, db } = await reinitializeFirebase(firebaseConfig)

      if (!app) {
        throw new Error("Failed to initialize Firebase app")
      }

      // Save config to localStorage for convenience
      localStorage.setItem("firebaseConfig", JSON.stringify(firebaseConfig))

      // Update status
      setStatus("success")
      setMessage(
        `Firebase successfully re-initialized! Auth: ${auth ? "Available" : "Not available"}, Firestore: ${db ? "Available" : "Not available"}`,
      )

      // Update current config display
      await checkCurrentConfig()
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image src="/images/firebase-logo.png" alt="Firebase Logo" width={40} height={40} className="rounded-md" />
          <div>
            <CardTitle>Re-initialize Firebase API</CardTitle>
            <CardDescription>Update your Firebase configuration and re-initialize the API</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status alerts */}
        {status === "success" && (
          <div className="flex flex-col items-center mb-4">
            <Image src="/images/setup-success.png" alt="Setup Success" width={100} height={100} className="mb-4" />
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 w-full">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </div>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Current config info */}
        {currentConfig && (
          <div className="rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium mb-2">Current Firebase Status:</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Initialized:</span>{" "}
                {currentConfig.initialized ? (
                  <span className="text-green-600 dark:text-green-400">Yes</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">No</span>
                )}
              </p>
              {currentConfig.initialized && (
                <>
                  <p>
                    <span className="font-medium">App Name:</span> {currentConfig.appName || "[DEFAULT]"}
                  </p>
                  <p>
                    <span className="font-medium">Project ID:</span>{" "}
                    {currentConfig.options?.projectId || "Not available"}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Config form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Firebase Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Enter your Firebase configuration details below to re-initialize the API
          </p>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIzaSyC..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authDomain">Auth Domain</Label>
            <Input
              id="authDomain"
              value={authDomain}
              onChange={(e) => setAuthDomain(e.target.value)}
              placeholder="your-project-id.firebaseapp.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="your-project-id"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storageBucket">Storage Bucket</Label>
            <Input
              id="storageBucket"
              value={storageBucket}
              onChange={(e) => setStorageBucket(e.target.value)}
              placeholder="your-project-id.appspot.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
            <Input
              id="messagingSenderId"
              value={messagingSenderId}
              onChange={(e) => setMessagingSenderId(e.target.value)}
              placeholder="123456789012"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appId">App ID</Label>
            <Input
              id="appId"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="1:123456789012:web:abc123def456"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkCurrentConfig} disabled={status === "loading"}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
        <Button onClick={handleInitialize} disabled={status === "loading" || !apiKey || !projectId}>
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            "Re-initialize Firebase"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

