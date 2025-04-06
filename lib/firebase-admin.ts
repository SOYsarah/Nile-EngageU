// This file provides a Firebase Admin SDK that works in both development and preview environments

// Create a mock implementation for preview mode
const createMockAdmin = () => {
  console.log("Using mock Firebase Admin SDK for preview mode")

  // Mock auth implementation
  const mockAuth = {
    verifySessionCookie: async () => ({ uid: "mock-user-id" }),
    createSessionCookie: async () => "mock-session-cookie",
    updateUser: async () => ({}),
    getUser: async () => ({
      uid: "mock-user-id",
      email: "mock@example.com",
      displayName: "Mock User",
    }),
  }

  // Mock firestore implementation
  const mockFirestore = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: true, data: () => ({}) }),
        set: async () => {},
        update: async () => {},
      }),
    }),
  }

  return {
    auth: mockAuth,
    adminDb: mockFirestore,
  }
}

// Check if we're in a Node.js environment (server-side)
const isServer = typeof window === "undefined"

// Initialize Firebase Admin SDK or return mock implementation
let auth
let adminDb

if (isServer) {
  try {
    // Check if we have the required environment variables
    const hasRequiredEnvVars =
      process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY

    if (hasRequiredEnvVars) {
      // Import Firebase Admin SDK dynamically to avoid issues in preview environments
      const { cert, initializeApp, getApps } = require("firebase-admin/app")
      const { getAuth } = require("firebase-admin/auth")
      const { getFirestore } = require("firebase-admin/firestore")

      // Initialize Firebase Admin SDK if it hasn't been initialized yet
      if (!getApps().length) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined

        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
          }),
        })
      }

      auth = getAuth()
      adminDb = getFirestore()

      console.log("Firebase Admin SDK initialized successfully")
    } else {
      // Use mock implementation if environment variables are missing
      const mockAdmin = createMockAdmin()
      auth = mockAdmin.auth
      adminDb = mockAdmin.adminDb
    }
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error)

    // Use mock implementation if there's an error
    const mockAdmin = createMockAdmin()
    auth = mockAdmin.auth
    adminDb = mockAdmin.adminDb
  }
} else {
  // Client-side: provide empty objects to prevent errors
  // These should never be used on the client
  auth = {}
  adminDb = {}
}

export { auth, adminDb }

