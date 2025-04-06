"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function AuthStatusIndicator() {
  const { user, isLoading } = useAuth()
  const [showStatus, setShowStatus] = useState(true)

  // Hide the status after 5 seconds
  useEffect(() => {
    if (user || (!isLoading && !user)) {
      const timer = setTimeout(() => {
        setShowStatus(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [user, isLoading])

  if (!showStatus) return null

  if (isLoading) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Initializing Authentication</AlertTitle>
        <AlertDescription>Setting up authentication services...</AlertDescription>
      </Alert>
    )
  }

  if (user) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Authenticated</AlertTitle>
        <AlertDescription>Signed in as {user.email}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="fixed bottom-4 right-4 w-auto max-w-md bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Not Authenticated</AlertTitle>
      <AlertDescription>Please sign in to access all features</AlertDescription>
    </Alert>
  )
}

