"use client"

import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase/firebase-client"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Send email using the firestore-send-email extension
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string,
  cc?: string | string[],
  bcc?: string | string[],
) {
  try {
    const db = await getFirebaseDb()
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    // Format recipients
    const toArray = Array.isArray(to) ? to : [to]
    const ccArray = cc ? (Array.isArray(cc) ? cc : [cc]) : []
    const bccArray = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : []

    // Add email to the mail collection
    await addDoc(collection(db, "mail"), {
      to: toArray,
      cc: ccArray.length > 0 ? ccArray : null,
      bcc: bccArray.length > 0 ? bccArray : null,
      message: {
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML if text not provided
      },
      created_at: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { error: "Failed to send email" }
  }
}

// Upload and resize image using the storage-resize-images extension
export async function uploadAndResizeImage(
  file: File,
  path: string,
): Promise<{ url: string; resizedUrls: Record<string, string> } | { error: string }> {
  try {
    const storage = await getFirebaseStorage()
    if (!storage) {
      throw new Error("Storage not initialized")
    }

    // Upload original file
    const storageRef = ref(storage, `${path}/${file.name}`)
    await uploadBytes(storageRef, file)

    // Get the download URL for the original file
    const url = await getDownloadURL(storageRef)

    // The extension will automatically create resized versions
    // We can construct the URLs for the resized images based on the extension's naming convention
    const resizedUrls: Record<string, string> = {}
    const sizes = [240, 480, 720, 960, 1200]

    for (const size of sizes) {
      const resizedPath = `${path}/${size}_${file.name.replace(/\.[^/.]+$/, "")}.webp`
      const resizedRef = ref(storage, resizedPath)

      try {
        // This will throw an error if the resized image doesn't exist yet
        // We'll need to wait a moment for the extension to process the image
        const resizedUrl = await getDownloadURL(resizedRef)
        resizedUrls[size.toString()] = resizedUrl
      } catch (error) {
        console.warn(`Resized image at ${size}px not available yet`)
      }
    }

    return { url, resizedUrls }
  } catch (error) {
    console.error("Error uploading and resizing image:", error)
    return { error: "Failed to upload and resize image" }
  }
}

// Increment a counter using the firestore-counter extension
export async function incrementCounter(documentPath: string, field: string, incrementBy = 1) {
  try {
    const db = await getFirebaseDb()
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    // The counter extension uses a special field format: field__increment
    const counterField = `${field}__increment`

    // Add a document to the _counter_shards_ subcollection
    const counterRef = collection(db, documentPath, "_counter_shards_", counterField)
    await addDoc(counterRef, { value: incrementBy })

    return { success: true }
  } catch (error) {
    console.error("Error incrementing counter:", error)
    return { error: "Failed to increment counter" }
  }
}

