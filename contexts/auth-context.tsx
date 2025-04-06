"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/firebase-client"

// Define types
export type UserProfile = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  isAdmin?: boolean
  department?: string
  studentId?: string
  bio?: string
  createdAt?: Date
  lastLogin?: Date
}

type AuthError = {
  code?: string
  message: string
}

type AuthResult<T = any> = {
  error: AuthError | null
  data?: T
  success?: boolean
}

type AuthContextType = {
  user: UserProfile | null
  userProfile: Record<string, any> | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string, remember?: boolean) => Promise<AuthResult>
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<AuthResult>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult>
  sendVerificationEmail: () => Promise<AuthResult>
  updateProfile: (data: Partial<UserProfile>) => Promise<AuthResult>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => ({ error: { message: "Auth not initialized" } }),
  signUp: async () => ({ error: { message: "Auth not initialized" } }),
  signOut: async () => {},
  resetPassword: async () => ({ error: { message: "Auth not initialized" } }),
  sendVerificationEmail: async () => ({ error: { message: "Auth not initialized" } }),
  updateProfile: async () => ({ error: { message: "Auth not initialized" } }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userProfile, setUserProfile] = useState<Record<string, any> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // Initialize auth and listen for auth state changes
  useEffect(() => {
    // Skip on server
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    let unsubscribe: () => void = () => {}

    const initAuth = async () => {
      try {
        const auth = await getFirebaseAuth()
        const db = await getFirebaseDb()

        if (!auth || !db) {
          console.error("Auth or Firestore not initialized")
          setIsLoading(false)
          return
        }

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in
            const userObj: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            }

            // Get additional user data from Firestore
            try {
              const userDocRef = doc(db, "users", firebaseUser.uid)
              const userDoc = await getDoc(userDocRef)

              if (userDoc.exists()) {
                const userData = userDoc.data()
                setUserProfile(userData)

                // Check if user is admin
                if (userData.role === "admin") {
                  setIsAdmin(true)
                  userObj.isAdmin = true
                }

                // Add additional profile data to user object
                if (userData.department) userObj.department = userData.department
                if (userData.student_id) userObj.studentId = userData.student_id
                if (userData.bio) userObj.bio = userData.bio
              }
            } catch (error) {
              console.error("Error fetching user profile:", error)
            }

            setUser(userObj)
          } else {
            // User is signed out
            setUser(null)
            setUserProfile(null)
            setIsAdmin(false)
          }
          setIsLoading(false)
        })
      } catch (error) {
        console.error("Error initializing auth:", error)
        setIsLoading(false)
      }
    }

    initAuth()

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string, remember = true): Promise<AuthResult> => {
    try {
      const auth = await getFirebaseAuth()
      if (!auth) {
        return { error: { message: "Authentication not initialized" } }
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Update last login in Firestore
      const db = await getFirebaseDb()
      if (db) {
        try {
          await setDoc(
            doc(db, "users", userCredential.user.uid),
            {
              last_login: serverTimestamp(),
            },
            { merge: true },
          )
        } catch (error) {
          console.error("Error updating last login:", error)
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      return { error: null, data: userCredential.user }
    } catch (err: any) {
      console.error("Sign in error:", err)
      let errorMessage = "Failed to sign in. Please try again."

      // Provide more specific error messages
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please try again."
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later."
      }

      return { error: { code: err.code, message: errorMessage } }
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, userData = {}): Promise<AuthResult> => {
    try {
      const auth = await getFirebaseAuth()
      const db = await getFirebaseDb()

      if (!auth || !db) {
        return { error: { message: "Authentication or database not initialized" } }
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile if name is provided
      if (userData.full_name) {
        await firebaseUpdateProfile(user, {
          displayName: userData.full_name,
        })
      }

      // Send email verification
      await sendEmailVerification(user)

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        display_name: userData.full_name || null,
        created_at: serverTimestamp(),
        ...userData,
      })

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      })

      return { error: null, data: user, success: true }
    } catch (err: any) {
      console.error("Sign up error:", err)
      let errorMessage = "Failed to create account. Please try again."

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please use a different email or try signing in."
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password."
      }

      return { error: { code: err.code, message: errorMessage } }
    }
  }

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      const auth = await getFirebaseAuth()
      if (!auth) {
        throw new Error("Authentication not initialized")
      }

      await firebaseSignOut(auth)

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })

      // Redirect to home page
      router.push("/")
    } catch (err) {
      console.error("Sign out error:", err)
      toast({
        title: "Sign Out Failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Password reset function
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      const auth = await getFirebaseAuth()
      if (!auth) {
        return { error: { message: "Authentication not initialized" } }
      }

      await sendPasswordResetEmail(auth, email)

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
      })

      return { error: null, success: true }
    } catch (err: any) {
      console.error("Password reset error:", err)
      let errorMessage = "Failed to send password reset email. Please try again."

      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address."
      }

      return { error: { code: err.code, message: errorMessage } }
    }
  }

  // Send verification email function
  const sendVerificationEmail = async (): Promise<AuthResult> => {
    try {
      const auth = await getFirebaseAuth()
      if (!auth || !auth.currentUser) {
        return { error: { message: "You must be signed in to verify your email" } }
      }

      await sendEmailVerification(auth.currentUser)

      toast({
        title: "Verification Email Sent",
        description: "Please check your email to verify your account.",
      })

      return { error: null, success: true }
    } catch (err: any) {
      console.error("Error sending verification email:", err)
      return { error: { code: err.code, message: "Failed to send verification email" } }
    }
  }

  // Update user profile function
  const updateProfile = async (data: Partial<UserProfile>): Promise<AuthResult> => {
    try {
      const auth = await getFirebaseAuth()
      const db = await getFirebaseDb()

      if (!auth || !db || !auth.currentUser) {
        return { error: { message: "You must be signed in to update your profile" } }
      }

      const uid = auth.currentUser.uid

      // Update Firebase Auth profile if display name or photo URL is provided
      if (data.displayName || data.photoURL) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: data.displayName || auth.currentUser.displayName,
          photoURL: data.photoURL || auth.currentUser.photoURL,
        })
      }

      // Update Firestore document
      const userDocRef = doc(db, "users", uid)

      const updateData: Record<string, any> = {
        updated_at: serverTimestamp(),
      }

      if (data.displayName) updateData.display_name = data.displayName
      if (data.department) updateData.department = data.department
      if (data.studentId) updateData.student_id = data.studentId
      if (data.bio) updateData.bio = data.bio

      await setDoc(userDocRef, updateData, { merge: true })

      // Update local state
      setUser((prev) => (prev ? { ...prev, ...data } : null))

      // Update profile state
      const updatedProfile = { ...userProfile, ...updateData }
      setUserProfile(updatedProfile)

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })

      return { error: null, success: true }
    } catch (err: any) {
      console.error("Error updating profile:", err)
      return { error: { code: err.code, message: "Failed to update profile" } }
    }
  }

  const value = {
    user,
    userProfile,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    sendVerificationEmail,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

