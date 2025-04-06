"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/firebase-admin"

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

export async function updateUserProfile(formData: FormData) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "Not authenticated" }
    }

    const fullName = formData.get("fullName") as string
    const department = formData.get("department") as string
    const studentId = formData.get("studentId") as string
    const bio = formData.get("bio") as string

    // In preview mode, just log the data and return success
    if (process.env.NODE_ENV !== "production") {
      console.log("Mock profile update:", { fullName, department, studentId, bio })
      revalidatePath("/profile")
      return { success: true }
    }

    // In production, update the profile in Firestore
    // This code won't run in preview mode
    const { updateUserProfile: updateFirestoreProfile } = await import("@/lib/firestore")
    const result = await updateFirestoreProfile(userId, {
      full_name: fullName,
      department,
      student_id: studentId,
      bio,
    })

    if (result.error) {
      return { error: result.error }
    }

    // Update user display name in Firebase Auth
    await auth.updateUser(userId, {
      displayName: fullName,
    })

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { error: "Failed to update profile" }
  }
}

export async function updateUserInterests(formData: FormData) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "Not authenticated" }
    }

    // Get all selected interests
    const categories = formData.getAll("categories") as string[]
    const clubs = formData.getAll("clubs") as string[]

    // In preview mode, just log the data and return success
    if (process.env.NODE_ENV !== "production") {
      console.log("Mock interests update:", { categories, clubs })
      revalidatePath("/profile/preferences")
      return { success: true }
    }

    // In production, store in Firestore
    // This code won't run in preview mode
    const { db } = await import("@/lib/firebase")
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")

    const userInterestsRef = doc(db, "user_interests", userId)
    await setDoc(
      userInterestsRef,
      {
        categories,
        clubs,
        updated_at: serverTimestamp(),
      },
      { merge: true },
    )

    revalidatePath("/profile/preferences")
    return { success: true }
  } catch (error) {
    console.error("Error updating interests:", error)
    return { error: "Failed to update interests" }
  }
}

export async function requestParticipationCertificate(formData: FormData) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "Not authenticated" }
    }

    const certificateType = formData.get("certificateType") as string
    const details = formData.get("details") as string

    // In preview mode, just log the data and return success
    if (process.env.NODE_ENV !== "production") {
      console.log("Mock certificate request:", { certificateType, details })
      revalidatePath("/profile/certificates")
      return { success: true }
    }

    // In production, request certificate in Firestore
    // This code won't run in preview mode
    const { requestCertificate } = await import("@/lib/firestore")
    const result = await requestCertificate(userId, certificateType, details)

    if (result.error) {
      return { error: result.error }
    }

    revalidatePath("/profile/certificates")
    return { success: true }
  } catch (error) {
    console.error("Error requesting certificate:", error)
    return { error: "Failed to submit certificate request" }
  }
}

