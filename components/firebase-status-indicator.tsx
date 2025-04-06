"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase-client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function FirebaseStatusIndicator() {
  const { initialized, initializing, error } = useFirebase()
  const [showStatus, setShowStatus] = useState(true)

  // Hide the status after 5 seconds
  useEffect(() => {
    if (initialized || error) {
      const timer = setTimeout(() => {
        setShowStatus(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [initialized, error])

  if (!showStatus) return null

  if (initializing) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Initializing Firebase</AlertTitle>
        <AlertDescription>Setting up authentication services...</AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Firebase Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (initialized) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Firebase Ready</AlertTitle>
        <AlertDescription>Authentication services initialized successfully</AlertDescription>
      </Alert>
    )
  }

  return null
}

