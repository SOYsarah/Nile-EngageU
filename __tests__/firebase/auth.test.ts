"use client"

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { renderHook, act } from "@testing-library/react"
import type { ReactNode } from "react"

// Mock Firebase modules
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}))

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendEmailVerification: vi.fn(),
  updateProfile: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null)
    return vi.fn() // Return unsubscribe function
  }),
}))

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => "timestamp"),
}))

vi.mock("@/lib/firebase/firebase-client", () => ({
  getFirebaseAuth: vi.fn(() => Promise.resolve({})),
  getFirebaseDb: vi.fn(() => Promise.resolve({})),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

vi.mock("@/components/ui/use-toast", () => ({
  toast: vi.fn(),
}))

// Helper to wrap components with AuthProvider
const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

describe("Auth Context", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("should initialize with default values", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.userProfile).toBeNull()
    expect(result.current.isAdmin).toBe(false)
    expect(typeof result.current.signIn).toBe("function")
    expect(typeof result.current.signUp).toBe("function")
    expect(typeof result.current.signOut).toBe("function")
    expect(typeof result.current.resetPassword).toBe("function")
    expect(typeof result.current.sendVerificationEmail).toBe("function")
    expect(typeof result.current.updateProfile).toBe("function")
  })

  it("should handle sign in", async () => {
    const mockSignIn = vi.fn(() => Promise.resolve({ user: { uid: "123" } }))
    const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import("firebase/auth")
    ;(signInWithEmailAndPassword as any).mockImplementation(mockSignIn)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signIn("test@example.com", "password")
    })

    expect(mockSignIn).toHaveBeenCalled()
  })

  it("should handle sign up", async () => {
    const mockSignUp = vi.fn(() => Promise.resolve({ user: { uid: "123" } }))
    const { createUserWithEmailAndPassword } = await import("firebase/auth")
    ;(createUserWithEmailAndPassword as any).mockImplementation(mockSignUp)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signUp("test@example.com", "password")
    })

    expect(mockSignUp).toHaveBeenCalled()
  })

  it("should handle sign out", async () => {
    const mockSignOut = vi.fn(() => Promise.resolve())
    const { signOut } = await import("firebase/auth")
    ;(signOut as any).mockImplementation(mockSignOut)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSignOut).toHaveBeenCalled()
  })

  it("should handle password reset", async () => {
    const mockResetPassword = vi.fn(() => Promise.resolve())
    const { sendPasswordResetEmail } = await import("firebase/auth")
    ;(sendPasswordResetEmail as any).mockImplementation(mockResetPassword)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.resetPassword("test@example.com")
    })

    expect(mockResetPassword).toHaveBeenCalled()
  })
})

