import { FirebaseStatus } from "@/components/setup/firebase-status"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export default function SetupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Application Setup</h1>
          <p className="text-muted-foreground">Configure your application services and integrations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FirebaseStatus />

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/firebase-logo.png"
                  alt="Firebase Logo"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <div>
                  <CardTitle>Authentication Setup</CardTitle>
                  <CardDescription>Configure user authentication for your application</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/images/auth-illustration.png"
                  alt="Authentication"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <p className="text-sm">
                  Set up Firebase Authentication to enable user sign-up, sign-in, and account management features. This
                  includes email/password authentication, social logins, and more.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/setup/firebase">
                  Configure Authentication
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>Configure Firestore database for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Image
                  src="/images/firebase-console.png"
                  alt="Firebase Console"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <p className="text-sm">
                  Set up Firestore to store and sync data for your application. Firestore is a flexible, scalable NoSQL
                  cloud database that keeps your data in sync across client apps.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/setup/database">
                  Configure Database
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Authentication</CardTitle>
              <CardDescription>Test your Firebase authentication setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Image
                  src="/images/setup-success.png"
                  alt="Test Authentication"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <p className="text-sm">
                  Once you've configured Firebase Authentication, you can test the sign-up and sign-in functionality to
                  ensure everything is working correctly.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-up">
                  Go to Sign Up
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Debug Information</CardTitle>
              <CardDescription>Check detailed Firebase connection status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Image
                  src="/images/firebase-logo.png"
                  alt="Firebase Logo"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <p className="text-sm">
                  View detailed information about your Firebase connection, including authentication status, database
                  connection, and environment variables.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/debug">
                  View Debug Info
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

