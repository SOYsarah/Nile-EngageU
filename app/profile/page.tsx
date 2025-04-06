"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Settings, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserProfile } from "@/app/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await updateUserProfile(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your account information</p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="hidden md:block">
              <nav className="flex flex-col gap-2">
                <Link href="/profile" className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 font-medium">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/profile/preferences"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Preferences
                </Link>
                <Link
                  href="/profile/certificates"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  Certificates
                </Link>
              </nav>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and profile information</CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
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
                        <AlertDescription>Profile updated successfully!</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email || ""} disabled />
                      <p className="text-xs text-muted-foreground">
                        Your email address is used for login and cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" defaultValue={user?.user_metadata?.full_name || ""} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" name="department" defaultValue={user?.user_metadata?.department || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input id="studentId" name="studentId" defaultValue={user?.user_metadata?.student_id || ""} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        defaultValue={user?.user_metadata?.bio || ""}
                        placeholder="Tell us a bit about yourself"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Nile University Events</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecting students with campus activities and opportunities.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium">
              About
            </Link>
            <Link href="#" className="text-sm font-medium">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

