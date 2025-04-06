import { db } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"

// User profile functions
export async function getUserProfile(userId: string) {
  try {
    const docRef = doc(db, "profiles", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null }
    } else {
      return { data: null, error: "Profile not found" }
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return { data: null, error: "Failed to get profile" }
  }
}

export async function updateUserProfile(userId: string, data: any) {
  try {
    const docRef = doc(db, "profiles", userId)
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    })
    return { success: true, error: null }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// Event functions
export async function getEvents(category?: string) {
  try {
    let eventsQuery

    if (category && category !== "all") {
      eventsQuery = query(collection(db, "events"), where("category", "==", category), orderBy("date", "asc"))
    } else {
      eventsQuery = query(collection(db, "events"), orderBy("date", "asc"))
    }

    const querySnapshot = await getDocs(eventsQuery)
    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return { data: events, error: null }
  } catch (error) {
    console.error("Error getting events:", error)
    return { data: [], error: "Failed to get events" }
  }
}

export async function getEvent(eventId: string) {
  try {
    const docRef = doc(db, "events", eventId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
    } else {
      return { data: null, error: "Event not found" }
    }
  } catch (error) {
    console.error("Error getting event:", error)
    return { data: null, error: "Failed to get event" }
  }
}

export async function registerForEvent(eventId: string, userId: string) {
  try {
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

    // Register for the event
    await addDoc(collection(db, "event_registrations"), {
      event_id: eventId,
      user_id: userId,
      status: "registered",
      attended: false,
      created_at: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error registering for event:", error)
    return { error: "Failed to register for event" }
  }
}

export async function cancelEventRegistration(eventId: string, userId: string) {
  try {
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

    return { success: true }
  } catch (error) {
    console.error("Error canceling event registration:", error)
    return { error: "Failed to cancel registration" }
  }
}

// Club functions
export async function getClubs(category?: string) {
  try {
    let clubsQuery

    if (category && category !== "all") {
      clubsQuery = query(collection(db, "clubs"), where("category", "==", category))
    } else {
      clubsQuery = collection(db, "clubs")
    }

    const querySnapshot = await getDocs(clubsQuery)
    const clubs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return { data: clubs, error: null }
  } catch (error) {
    console.error("Error getting clubs:", error)
    return { data: [], error: "Failed to get clubs" }
  }
}

// Certificate request functions
export async function requestCertificate(userId: string, type: string, details: string) {
  try {
    await addDoc(collection(db, "certificate_requests"), {
      user_id: userId,
      type,
      details,
      status: "pending",
      created_at: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error requesting certificate:", error)
    return { error: "Failed to request certificate" }
  }
}

export async function getUserCertificates(userId: string) {
  try {
    const certificatesQuery = query(
      collection(db, "certificates"),
      where("user_id", "==", userId),
      orderBy("issued_at", "desc"),
    )

    const querySnapshot = await getDocs(certificatesQuery)
    const certificates = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return { data: certificates, error: null }
  } catch (error) {
    console.error("Error getting certificates:", error)
    return { data: [], error: "Failed to get certificates" }
  }
}

export async function getUserPendingRequests(userId: string) {
  try {
    const requestsQuery = query(
      collection(db, "certificate_requests"),
      where("user_id", "==", userId),
      where("status", "==", "pending"),
    )

    const querySnapshot = await getDocs(requestsQuery)
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return { data: requests, error: null }
  } catch (error) {
    console.error("Error getting pending requests:", error)
    return { data: [], error: "Failed to get pending requests" }
  }
}

