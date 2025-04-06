"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Check if the current user is an admin
async function isAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return false
  }

  // Check if user has admin role in metadata
  return session.user.app_metadata?.role === "admin"
}

// Approve a certificate request
export async function approveCertificateRequest(requestId: string) {
  try {
    if (!(await isAdmin())) {
      return { error: "Unauthorized. Admin access required." }
    }

    const { error } = await supabase
      .from("certificate_requests")
      .update({
        status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/certificates")
    return { success: true }
  } catch (error) {
    console.error("Error approving certificate request:", error)
    return { error: "Failed to approve certificate request" }
  }
}

// Reject a certificate request
export async function rejectCertificateRequest(requestId: string, message: string) {
  try {
    if (!(await isAdmin())) {
      return { error: "Unauthorized. Admin access required." }
    }

    const { error } = await supabase
      .from("certificate_requests")
      .update({
        status: "rejected",
        admin_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/certificates")
    return { success: true }
  } catch (error) {
    console.error("Error rejecting certificate request:", error)
    return { error: "Failed to reject certificate request" }
  }
}

// Create a new event
export async function createEvent(formData: FormData) {
  try {
    if (!(await isAdmin())) {
      return { error: "Unauthorized. Admin access required." }
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const longDescription = formData.get("longDescription") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const location = formData.get("location") as string
    const category = formData.get("category") as string
    const organizer = formData.get("organizer") as string
    const maxAttendees = Number.parseInt(formData.get("maxAttendees") as string) || null
    const imageUrl = (formData.get("imageUrl") as string) || null

    const { error, data } = await supabase
      .from("events")
      .insert({
        title,
        description,
        long_description: longDescription,
        date,
        time,
        location,
        category,
        organizer,
        max_attendees: maxAttendees,
        image_url: imageUrl,
        created_by: session?.user.id,
      })
      .select()

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/events")
    revalidatePath("/admin/events")
    return { success: true, eventId: data[0].id }
  } catch (error) {
    console.error("Error creating event:", error)
    return { error: "Failed to create event" }
  }
}

// Mark attendance for an event
export async function markAttendance(eventId: string, userId: string, attended: boolean) {
  try {
    if (!(await isAdmin())) {
      return { error: "Unauthorized. Admin access required." }
    }

    const { error } = await supabase
      .from("event_registrations")
      .update({
        attended,
        updated_at: new Date().toISOString(),
      })
      .eq("event_id", eventId)
      .eq("user_id", userId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/admin/events/${eventId}`)
    return { success: true }
  } catch (error) {
    console.error("Error marking attendance:", error)
    return { error: "Failed to mark attendance" }
  }
}

