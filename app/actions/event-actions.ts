"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/firebase-admin"
import { validateData, eventRegistrationSchema } from "@/lib/firebase/validation"

// Helper function to get the current user ID from the session cookie
async function getCurrentUserId() {
  const sessionCookie = cookies().get("__session")?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie)
    return decodedClaims.uid
  } catch (error) {
    console.error("Error verifying session cookie:", error)

    // In preview mode, return a mock user ID
    if (process.env.NODE_ENV !== "production") {
      console.log("Using mock user ID for preview mode")
      return "preview-user-id"
    }

    return null
  }
}

// Register for an event
export async function registerForEvent(eventId: string) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "Not authenticated" }
    }

    // In preview mode, just return success
    if (process.env.NODE_ENV !== "production") {
      console.log(`Mock registration for event ${eventId} by user ${userId}`)
      revalidatePath(`/events/${eventId}`)
      revalidatePath("/my-activities")
      return { success: true }
    }

    // Dynamically import Firestore modules only when needed
    const { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } = await import(
      "firebase/firestore"
    )
    const { getApp } = await import("firebase/app")

    const app = getApp()
    const db = getFirestore(app)

    // Check if already registered
    const registrationsQuery = query(
      collection(db, "event_registrations"),
      where("event_id", "==", eventId),
      where("user_id", "==", userId),
    )

    const querySnapshot = await getDocs(registrationsQuery)

    if (!querySnapshot.empty) {
      return { error: "You are already registered for this event" }
    }

    // Get event creator for security rules
    const { doc, getDoc } = await import("firebase/firestore")
    const eventDoc = await getDoc(doc(db, "events", eventId))

    if (!eventDoc.exists()) {
      return { error: "Event not found" }
    }

    const eventCreator = eventDoc.data().created_by

    // Validate registration data
    const registrationData = {
      event_id: eventId,
      user_id: userId,
      status: "registered",
      attended: false,
      event_creator: eventCreator,
      created_at: serverTimestamp(),
    }

    const validation = validateData(eventRegistrationSchema, registrationData)
    if (!validation.isValid) {
      console.error("Validation error:", validation.errors)
      return { error: "Invalid registration data" }
    }

    // Register for the event
    await addDoc(collection(db, "event_registrations"), registrationData)

    revalidatePath(`/events/${eventId}`)
    revalidatePath("/my-activities")
    return { success: true }
  } catch (error) {
    console.error("Error registering for event:", error)
    return { error: "Failed to register for event" }
  }
}

// Cancel registration for an event
export async function cancelEventRegistration(eventId: string) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "Not authenticated" }
    }

    // In preview mode, just return success
    if (process.env.NODE_ENV !== "production") {
      console.log(`Mock cancellation for event ${eventId} by user ${userId}`)
      revalidatePath(`/events/${eventId}`)
      revalidatePath("/my-activities")
      return { success: true }
    }

    // Dynamically import Firestore modules only when needed
    const { getFirestore, collection, query, where, getDocs, deleteDoc, doc } = await import("firebase/firestore")
    const { getApp } = await import("firebase/app")

    const app = getApp()
    const db = getFirestore(app)

    const registrationsQuery = query(
      collection(db, "event_registrations"),
      where("event_id", "==", eventId),
      where("user_id", "==", userId),
    )

    const querySnapshot = await getDocs(registrationsQuery)

    if (querySnapshot.empty) {
      return { error: "You are not registered for this event" }
    }

    // Delete the registration
    await deleteDoc(doc(db, "event_registrations", querySnapshot.docs[0].id))

    revalidatePath(`/events/${eventId}`)
    revalidatePath("/my-activities")
    return { success: true }
  } catch (error) {
    console.error("Error canceling event registration:", error)
    return { error: "Failed to cancel registration" }
  }
}

// Get user's registered events
export async function getUserEvents() {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "Not authenticated" }
    }

    // In preview mode, return mock data
    if (process.env.NODE_ENV !== "production") {
      return {
        data: [
          {
            id: "1",
            status: "registered",
            attended: false,
            events: {
              id: "1",
              title: "Tech Innovation Summit",
              description: "Join industry leaders and academics to explore the latest in technology innovation.",
              date: "March 15, 2025",
              time: "9:00 AM - 5:00 PM",
              location: "Main Auditorium",
              category: "Academic",
              image_url: "/placeholder.svg?height=200&width=300",
            },
          },
        ],
      }
    }

    // Dynamically import Firestore modules only when needed
    const { getFirestore, collection, query, where, getDocs, doc, getDoc } = await import("firebase/firestore")
    const { getApp } = await import("firebase/app")

    const app = getApp()
    const db = getFirestore(app)

    // Get user registrations
    const registrationsQuery = query(collection(db, "event_registrations"), where("user_id", "==", userId))

    const registrationsSnapshot = await getDocs(registrationsQuery)

    if (registrationsSnapshot.empty) {
      return { data: [] }
    }

    // Get event details for each registration
    const events = await Promise.all(
      registrationsSnapshot.docs.map(async (regDoc) => {
        const regData = regDoc.data()
        const eventDoc = await getDoc(doc(db, "events", regData.event_id))

        if (!eventDoc.exists()) {
          return null
        }

        return {
          id: regDoc.id,
          status: regData.status,
          attended: regData.attended,
          events: {
            id: regData.event_id,
            ...eventDoc.data(),
          },
        }
      }),
    )

    // Filter out null values (events that no longer exist)
    const validEvents = events.filter((event) => event !== null)

    return { data: validEvents }
  } catch (error) {
    console.error("Error fetching user events:", error)
    return { error: "Failed to fetch events" }
  }
}

