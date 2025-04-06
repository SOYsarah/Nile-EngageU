"use client"

import { getFirebaseAnalytics } from "@/lib/firebase/firebase-client"
import { logEvent as firebaseLogEvent } from "firebase/analytics"

// Event types
export type AnalyticsEvent =
  | "page_view"
  | "login"
  | "sign_up"
  | "event_registration"
  | "event_cancellation"
  | "club_join"
  | "certificate_request"
  | "profile_update"
  | "search"

// Log an event to Firebase Analytics
export async function logEvent(eventName: AnalyticsEvent, eventParams?: Record<string, any>) {
  try {
    const analytics = await getFirebaseAnalytics()
    if (!analytics) {
      console.warn("Analytics not available")
      return
    }

    firebaseLogEvent(analytics, eventName, eventParams)
  } catch (error) {
    console.error("Error logging analytics event:", error)
  }
}

// Track page views
export function usePageView(pageName: string) {
  if (typeof window !== "undefined") {
    // Use a timeout to ensure the page has fully loaded
    setTimeout(() => {
      logEvent("page_view", { page_name: pageName })
    }, 1000)
  }
}

