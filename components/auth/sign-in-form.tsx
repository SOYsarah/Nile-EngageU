"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function SignInForm() {
  const router = useRouter()

  // Get search params for redirect URL
  const redirectUrl =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") || "/" : "/"

  const { signIn, isLoading: authLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{
    email?: string
    password?: string
  }>({})

  // Clear errors when inputs change
  useEffect(() => {
    if (email) setFormErrors((prev) => ({ ...prev, email: undefined }))
    if (password) setFormErrors((prev) => ({ ...prev, password: undefined }))
    setError(null)
  }, [email, password])

  const validateForm = () => {
    const errors: {
      email?: string
      password?: string
    } = {}
    let isValid = true

    // Email validation
    if (!email) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password, rememberMe)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Redirect after successful login
      router.push(redirectUrl)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
      setIsLoading(false)
    }
  }

  // Show loading state if auth is still initializing
  if (authLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Loading authentication service...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <Image
            src="/images/auth-illustration.png"
            alt="Authentication"
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m.example@nileuniversity.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={formErrors.email ? "border-red-500" : ""}
              disabled={isLoading}
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              required
            />
            {formErrors.email && (
              <p id="email-error" className="text-sm text-red-500">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={formErrors.password ? "border-red-500" : ""}
              disabled={isLoading}
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? "password-error" : undefined}
              required
            />
            {formErrors.password && (
              <p id="password-error" className="text-sm text-red-500">
                {formErrors.password}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

