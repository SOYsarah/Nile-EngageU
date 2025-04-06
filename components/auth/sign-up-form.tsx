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
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function SignUpForm() {
  const router = useRouter()
  const { signUp, isLoading: authLoading } = useAuth()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [studentId, setStudentId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Clear specific field error when input changes
  useEffect(() => {
    if (email) setFormErrors((prev) => ({ ...prev, email: "" }))
    if (password) setFormErrors((prev) => ({ ...prev, password: "" }))
    if (confirmPassword) setFormErrors((prev) => ({ ...prev, confirmPassword: "" }))
    if (fullName) setFormErrors((prev) => ({ ...prev, fullName: "" }))
    setError(null)
  }, [email, password, confirmPassword, fullName])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    let isValid = true

    // Full name validation
    if (!fullName.trim()) {
      errors.fullName = "Full name is required"
      isValid = false
    }

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
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
      isValid = false
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      errors.password = "Password must contain at least one letter and one number"
      isValid = false
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
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
    setSuccess(false)

    try {
      // Prepare user data
      const userData = {
        full_name: fullName,
        department,
        student_id: studentId,
      }

      const { error } = await signUp(email, password, userData)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setSuccess(true)

      // Redirect to home page after a delay
      setTimeout(() => {
        router.push("/")
      }, 3000)
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
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
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
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">Enter your information to create your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Registration successful! Please check your email to verify your account. You will be redirected to the
                homepage shortly.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={formErrors.fullName ? "border-red-500" : ""}
              disabled={isLoading || success}
              aria-invalid={!!formErrors.fullName}
              aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
              required
            />
            {formErrors.fullName && (
              <p id="fullName-error" className="text-sm text-red-500">
                {formErrors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m.example@nileuniversity.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={formErrors.email ? "border-red-500" : ""}
              disabled={isLoading || success}
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isLoading || success}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID (Optional)</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isLoading || success}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={formErrors.password ? "border-red-500" : ""}
              disabled={isLoading || success}
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? "password-error" : undefined}
              required
            />
            {formErrors.password && (
              <p id="password-error" className="text-sm text-red-500">
                {formErrors.password}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters and include letters and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={formErrors.confirmPassword ? "border-red-500" : ""}
              disabled={isLoading || success}
              aria-invalid={!!formErrors.confirmPassword}
              aria-describedby={formErrors.confirmPassword ? "confirmPassword-error" : undefined}
              required
            />
            {formErrors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-red-500">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading || success} aria-busy={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

