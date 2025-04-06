"use client"

import { toast } from "@/components/ui/use-toast"

// Firebase Auth error codes and messages
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "No account found with this email address.",
  "auth/wrong-password": "Invalid email or password. Please try again.",
  "auth/email-already-in-use": "This email is already in use. Please use a different email or try signing in.",
  "auth/weak-password": "Password is too weak. Please use a stronger password.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email address but different sign-in credentials.",
  "auth/operation-not-allowed": "This sign-in method is not allowed. Please contact support.",
  "auth/too-many-requests": "Too many unsuccessful login attempts. Please try again later.",
  "auth/user-disabled": "This account has been disabled. Please contact support.",
  "auth/requires-recent-login": "This operation requires recent authentication. Please sign in again.",
  "auth/invalid-credential": "The credential is invalid. Please try again.",
  "auth/invalid-verification-code": "The verification code is invalid. Please try again.",
  "auth/invalid-verification-id": "The verification ID is invalid. Please try again.",
  "auth/missing-verification-code": "The verification code is missing. Please try again.",
  "auth/missing-verification-id": "The verification ID is missing. Please try again.",
  "auth/network-request-failed": "A network error occurred. Please check your connection and try again.",
}

// Firestore error codes and messages
const FIRESTORE_ERROR_MESSAGES: Record<string, string> = {
  "permission-denied": "You don't have permission to perform this operation.",
  "not-found": "The requested document was not found.",
  "already-exists": "The document already exists.",
  "failed-precondition": "The operation failed because a precondition was not met.",
  aborted: "The operation was aborted.",
  "out-of-range": "The operation was attempted past the valid range.",
  unimplemented: "The operation is not implemented or not supported.",
  internal: "An internal error occurred. Please try again later.",
  unavailable: "The service is currently unavailable. Please try again later.",
  "data-loss": "Unrecoverable data loss or corruption.",
  unauthenticated: "The request does not have valid authentication credentials.",
}

// Storage error codes and messages
const STORAGE_ERROR_MESSAGES: Record<string, string> = {
  "storage/unknown": "An unknown error occurred.",
  "storage/object-not-found": "The file does not exist.",
  "storage/bucket-not-found": "The storage bucket does not exist.",
  "storage/project-not-found": "The project does not exist.",
  "storage/quota-exceeded": "Storage quota exceeded.",
  "storage/unauthenticated": "User is not authenticated.",
  "storage/unauthorized": "User is not authorized to perform the desired action.",
  "storage/retry-limit-exceeded": "The maximum time limit for the operation has been exceeded.",
  "storage/invalid-checksum": "The file on the client does not match the checksum of the file received by the server.",
  "storage/canceled": "The operation was canceled by the user.",
  "storage/invalid-event-name": "Invalid event name provided.",
  "storage/invalid-url": "Invalid URL provided.",
  "storage/invalid-argument": "Invalid argument provided.",
  "storage/no-default-bucket": "No default bucket has been set.",
  "storage/cannot-slice-blob": "The blob cannot be sliced.",
  "storage/server-file-wrong-size":
    "The file on the server does not match the size of the file received by the client.",
}

// Generic error handler
export function handleFirebaseError(
  error: any,
  defaultMessage = "An unexpected error occurred. Please try again.",
): string {
  console.error("Firebase error:", error)

  // Extract error code
  const errorCode = error?.code || ""

  // Check for auth errors
  if (errorCode.startsWith("auth/")) {
    const message = AUTH_ERROR_MESSAGES[errorCode] || defaultMessage
    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    })
    return message
  }

  // Check for Firestore errors
  if (errorCode.startsWith("firestore/")) {
    const firestoreCode = errorCode.replace("firestore/", "")
    const message = FIRESTORE_ERROR_MESSAGES[firestoreCode] || defaultMessage
    toast({
      title: "Database Error",
      description: message,
      variant: "destructive",
    })
    return message
  }

  // Check for Storage errors
  if (errorCode.startsWith("storage/")) {
    const message = STORAGE_ERROR_MESSAGES[errorCode] || defaultMessage
    toast({
      title: "Storage Error",
      description: message,
      variant: "destructive",
    })
    return message
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("network")) {
    const message = "Network error. Please check your connection and try again."
    toast({
      title: "Connection Error",
      description: message,
      variant: "destructive",
    })
    return message
  }

  // Default error handling
  toast({
    title: "Error",
    description: defaultMessage,
    variant: "destructive",
  })
  return defaultMessage
}

// Specific error handler for auth operations
export function handleAuthError(error: any, defaultMessage = "Authentication failed. Please try again."): string {
  return handleFirebaseError(error, defaultMessage)
}

// Specific error handler for database operations
export function handleDbError(error: any, defaultMessage = "Database operation failed. Please try again."): string {
  return handleFirebaseError(error, defaultMessage)
}

// Specific error handler for storage operations
export function handleStorageError(error: any, defaultMessage = "File operation failed. Please try again."): string {
  return handleFirebaseError(error, defaultMessage)
}

