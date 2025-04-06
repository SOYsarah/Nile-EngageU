"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { FirebaseStatus } from "@/components/firebase-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

export default function DebugPage() {
  const { user, isLoading } = useAuth()
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    // Get environment variables (safely)
    setEnvVars({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✓ Set" : "✗ Missing",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✓ Set" : "✗ Missing",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        ? "✓ Set"
        : "✗ Missing",
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing",
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <div className="mb-8 flex items-center gap-4">
          <Image src="/images/firebase-logo.png" alt="Firebase Logo" width={60} height={60} className="rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold mb-2">Firebase Debug Page</h1>
            <p className="text-muted-foreground">Check the status of your Firebase configuration and connection</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Firebase Status</CardTitle>
              <CardDescription>Check if Firebase is properly initialized</CardDescription>
            </CardHeader>
            <CardContent>
              <FirebaseStatus />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Check if all required environment variables are set</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <li
                    key={key}
                    className={
                      value === "✓ Set" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }
                  >
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Check if authentication is working</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading authentication status...</p>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <Image src="/images/setup-success.png" alt="Authentication Success" width={80} height={80} />
                  <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <AlertDescription>
                      <div className="font-medium">Authenticated as:</div>
                      <div className="text-sm mt-1">{user.email || "No email"}</div>
                      <div className="text-sm">User ID: {user.uid}</div>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Image src="/images/auth-illustration.png" alt="Authentication" width={80} height={80} />
                  <Alert className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                    <AlertDescription>
                      <div className="font-medium">Not authenticated</div>
                      <div className="text-sm mt-1">Sign in to test authentication</div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/auth/sign-in">Go to Sign In</a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Steps</CardTitle>
              <CardDescription>Try these steps if you're having issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Check that all environment variables are set correctly</li>
                <li>Verify that Firebase Authentication is enabled in your Firebase console</li>
                <li>Make sure Email/Password authentication is enabled in Firebase console</li>
                <li>Check that Firestore database is created in your Firebase project</li>
                <li>Try clearing your browser cache and reloading the page</li>
                <li>Check browser console for any additional error messages</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

