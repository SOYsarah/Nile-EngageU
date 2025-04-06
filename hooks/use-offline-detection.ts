"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [wasOffline, setWasOffline] = useState<boolean>(false)

  useEffect(() => {
    // Skip on server
    if (typeof window === "undefined") return

    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        toast({
          title: "You're back online",
          description: "Your changes will now be synchronized with the server.",
        })
        setWasOffline(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      toast({
        title: "You're offline",
        description: "The app will continue to work, but changes won't be saved until you're back online.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [wasOffline])

  return { isOnline, wasOffline }
}

