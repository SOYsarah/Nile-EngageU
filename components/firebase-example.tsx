"use client"

import { useState } from "react"
import { useFirebase } from "@/hooks/use-firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"
import Image from "next/image"

export function FirebaseExample() {
  const { auth, db, initialized, initializing, error } = useFirebase()
  const [authStatus, setAuthStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkAuth = async () => {
    if (!auth) {
      setAuthStatus("Auth is not available")
      return
    }

    setIsLoading(true)
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        setAuthStatus(`Signed in as: ${currentUser.email}`)
      } else {
        setAuthStatus("Not signed in")
      }
    } catch (err) {
      setAuthStatus(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error initializing Firebase: {error.message}</AlertDescription>
      </Alert>
    )
  }

  if (initializing) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Initializing Firebase...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Image src="/images/firebase-logo.png" alt="Firebase Logo" width={40} height={40} className="rounded-md" />
          <div>
            <CardTitle>Firebase Example</CardTitle>
            <CardDescription>Example of using Firebase in a component</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${initialized ? "bg-green-500" : "bg-amber-500"}`}></div>
          <p>
            Firebase status: <span className="font-medium">{initialized ? "Initialized" : "Not initialized"}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${auth ? "bg-green-500" : "bg-gray-300"}`}></div>
            <p>
              Auth available: <span className="font-medium">{auth ? "Yes" : "No"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${db ? "bg-green-500" : "bg-gray-300"}`}></div>
            <p>
              Firestore available: <span className="font-medium">{db ? "Yes" : "No"}</span>
            </p>
          </div>
        </div>

        {authStatus && (
          <Alert
            className={
              authStatus.includes("Signed in")
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            }
          >
            {authStatus.includes("Signed in") && <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{authStatus}</AlertDescription>
          </Alert>
        )}

        {initialized && (
          <div className="flex justify-center mt-6">
            <Image
              src="/images/setup-success.png"
              alt="Firebase Success"
              width={120}
              height={120}
              className="opacity-80"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkAuth} disabled={isLoading || !auth} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Auth Status"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

