"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<any>(null)

  const handleSignUp = async () => {
    setStatus("loading")
    setMessage("Creating account...")

    try {
      // Dynamically import Firebase
      const { initializeApp, getApps } = await import("firebase/app")
      const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth")

      // Initialize Firebase if not already initialized
      let app
      if (getApps().length === 0) {
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }
        app = initializeApp(firebaseConfig)
      } else {
        app = getApps()[0]
      }

      const auth = getAuth(app)

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setStatus("success")
      setMessage("Account created successfully!")
    } catch (error: any) {
      console.error("Sign up error:", error)
      setStatus("error")
      setMessage(error.message || "Failed to create account")
    }
  }

  const handleSignIn = async () => {
    setStatus("loading")
    setMessage("Signing in...")

    try {
      // Dynamically import Firebase
      const { initializeApp, getApps } = await import("firebase/app")
      const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth")

      // Initialize Firebase if not already initialized
      let app
      if (getApps().length === 0) {
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }
        app = initializeApp(firebaseConfig)
      } else {
        app = getApps()[0]
      }

      const auth = getAuth(app)

      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setStatus("success")
      setMessage("Signed in successfully!")
    } catch (error: any) {
      console.error("Sign in error:", error)
      setStatus("error")
      setMessage(error.message || "Failed to sign in")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Test Firebase Authentication</h1>
          <p className="text-muted-foreground">Verify that your Firebase authentication setup is working correctly</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Test</CardTitle>
              <CardDescription>Test Firebase authentication with email and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "success" && (
                <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {status === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                />
              </div>

              {user && (
                <div className="rounded-md bg-muted p-4">
                  <h3 className="text-sm font-medium mb-2">Current User:</h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(
                      {
                        uid: user.uid,
                        email: user.email,
                        emailVerified: user.emailVerified,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSignUp} disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <Button onClick={handleSignIn} disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>What to do after setting up Firebase Authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <span className="font-medium">Try the actual authentication flow</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the sign-up and sign-in pages to test the full authentication experience.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Set up user profiles</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a Firestore collection to store additional user information.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Implement role-based access control</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add user roles (e.g., admin, student) to control access to different parts of your application.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Add social authentication</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable Google, Facebook, or other social login providers for a better user experience.
                  </p>
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/auth/sign-up">Go to Sign Up Page</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

