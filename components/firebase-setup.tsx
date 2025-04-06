"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Copy } from "lucide-react"

export function FirebaseSetup() {
  const [apiKey, setApiKey] = useState("")
  const [authDomain, setAuthDomain] = useState("")
  const [projectId, setProjectId] = useState("")
  const [storageBucket, setStorageBucket] = useState("")
  const [messagingSenderId, setMessagingSenderId] = useState("")
  const [appId, setAppId] = useState("")
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleTest = async () => {
    setStatus("testing")

    try {
      // Dynamically import Firebase
      const { initializeApp } = await import("firebase/app")
      const { getAuth, connectAuthEmulator } = await import("firebase/auth")

      const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
      }

      // Initialize Firebase
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)

      // If we got here without errors, Firebase initialized successfully
      setStatus("success")

      // Save config to localStorage for convenience
      localStorage.setItem("firebaseConfig", JSON.stringify(firebaseConfig))
    } catch (error) {
      console.error("Firebase initialization error:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    }
  }

  const handleCopyEnv = () => {
    const envContent = `
NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${appId}
    `.trim()

    navigator.clipboard
      .writeText(envContent)
      .then(() => {
        alert("Environment variables copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Firebase Setup</CardTitle>
        <CardDescription>Enter your Firebase configuration details to initialize your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Firebase has been successfully initialized. Your configuration has been saved.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorMessage || "Failed to initialize Firebase. Please check your configuration."}
            </AlertDescription>
          </Alert>
        )}

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
            placeholder="your-app.firebaseapp.com"
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
            placeholder="your-app.appspot.com"
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCopyEnv}>
          <Copy className="mr-2 h-4 w-4" />
          Copy as .env
        </Button>
        <Button onClick={handleTest} disabled={status === "testing"}>
          {status === "testing" ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}

