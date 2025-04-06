"use client"

import { useOfflineDetection } from "@/hooks/use-offline-detection"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline } = useOfflineDetection()

  if (isOnline) {
    return null
  }

  return (
    <Alert className="fixed bottom-4 left-4 w-auto max-w-md bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>You're offline</AlertTitle>
      <AlertDescription>
        The app will continue to work, but changes won't be saved until you're back online.
      </AlertDescription>
    </Alert>
  )
}

