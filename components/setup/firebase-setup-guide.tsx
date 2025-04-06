"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Copy, ExternalLink, ChevronRight, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

export function FirebaseSetupGuide() {
  const [apiKey, setApiKey] = useState("")
  const [authDomain, setAuthDomain] = useState("")
  const [projectId, setProjectId] = useState("")
  const [storageBucket, setStorageBucket] = useState("")
  const [messagingSenderId, setMessagingSenderId] = useState("")
  const [appId, setAppId] = useState("")
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState("create")

  const handleTest = async () => {
    setStatus("testing")

    try {
      // Dynamically import Firebase
      const { initializeApp } = await import("firebase/app")
      const { getAuth } = await import("firebase/auth")

      const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
      }

      // Initialize Firebase
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)

      // If we got here without errors, Firebase initialized successfully
      setStatus("success")

      // Save config to localStorage for convenience
      localStorage.setItem("firebaseConfig", JSON.stringify(firebaseConfig))
    } catch (error) {
      console.error("Firebase initialization error:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    }
  }

  const handleCopyEnv = () => {
    const envContent = `
NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${appId}

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=${projectId}
# You'll need to add these from the Firebase Admin SDK service account
# FIREBASE_CLIENT_EMAIL=your_client_email_here
# FIREBASE_PRIVATE_KEY="your_private_key_here"
   `.trim()

    navigator.clipboard
      .writeText(envContent)
      .then(() => {
        alert("Environment variables copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-8">
        <Image
          src="/images/firebase-logo.png"
          alt="Firebase Logo"
          width={120}
          height={120}
          className="rounded-lg shadow-md"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="create">1. Create Project</TabsTrigger>
          <TabsTrigger value="enable">2. Enable Authentication</TabsTrigger>
          <TabsTrigger value="config">3. Get Configuration</TabsTrigger>
          <TabsTrigger value="test">4. Test Connection</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create a Firebase Project</CardTitle>
              <CardDescription>
                First, you'll need to create a new Firebase project or use an existing one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/firebase-setup-guide.png"
                  alt="Firebase Setup Guide"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>

              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <div className="font-medium">Go to the Firebase Console</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit{" "}
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      console.firebase.google.com
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>{" "}
                    and sign in with your Google account.
                  </p>
                </li>
                <li>
                  <div className="font-medium">Create a new project</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on "Add project" and follow the setup wizard:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-2">
                    <li>Enter a project name (e.g., "Nile University Platform")</li>
                    <li>Choose whether to enable Google Analytics (recommended for tracking user engagement)</li>
                    <li>Accept the terms and click "Create project"</li>
                  </ul>
                </li>
                <li>
                  <div className="font-medium">Wait for project creation</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Firebase will take a moment to set up your project. Once complete, click "Continue".
                  </p>
                </li>
              </ol>

              <div className="rounded-md bg-muted p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Tip</h3>
                    <div className="mt-2 text-sm">
                      <p>
                        If you already have a Firebase project, you can skip this step and use your existing project.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("enable")} className="ml-auto">
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="enable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enable Authentication</CardTitle>
              <CardDescription>Set up authentication methods for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/firebase-console.png"
                  alt="Firebase Console"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>

              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <div className="font-medium">Navigate to Authentication</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    In your Firebase project dashboard, click on "Authentication" in the left sidebar.
                  </p>
                </li>
                <li>
                  <div className="font-medium">Get Started</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on the "Get started" button if this is your first time setting up authentication.
                  </p>
                </li>
                <li>
                  <div className="font-medium">Enable Email/Password authentication</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Under the "Sign-in method" tab, click on "Email/Password" and enable it.
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-2">
                    <li>Toggle "Email/Password" to enabled</li>
                    <li>
                      Consider enabling "Email link (passwordless sign-in)" if you want to allow users to sign in
                      without a password
                    </li>
                    <li>Click "Save"</li>
                  </ul>
                </li>
                <li>
                  <div className="font-medium">(Optional) Enable additional providers</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can also enable other authentication methods like Google, Facebook, or Twitter if needed.
                  </p>
                </li>
              </ol>

              <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-800 dark:text-amber-300" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Important</h3>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                      <p>
                        Make sure to set up proper security rules for your Firebase project. By default, Firebase allows
                        all authenticated users to read and write to your database.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("create")}>
                Previous Step
              </Button>
              <Button onClick={() => setActiveTab("config")}>
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Get Firebase Configuration</CardTitle>
              <CardDescription>
                Retrieve your Firebase configuration details to connect your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/auth-illustration.png"
                  alt="Authentication Illustration"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>

              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <div className="font-medium">Add a Web App to your Firebase project</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    In your Firebase project dashboard, click on the gear icon (⚙️) next to "Project Overview" and select
                    "Project settings".
                  </p>
                </li>
                <li>
                  <div className="font-medium">Register your app</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scroll down to the "Your apps" section and click on the web icon ({"</>"}):
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-2">
                    <li>Enter a nickname for your app (e.g., "Nile University Web")</li>
                    <li>(Optional) Enable Firebase Hosting if you plan to deploy your app using Firebase Hosting</li>
                    <li>Click "Register app"</li>
                  </ul>
                </li>
                <li>
                  <div className="font-medium">Copy your Firebase configuration</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    After registering, you'll see a code snippet with your Firebase configuration. Copy the
                    configuration object that looks like this:
                  </p>
                  <pre className="bg-muted p-3 rounded-md text-xs mt-2 overflow-auto">
                    {`const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};`}
                  </pre>
                </li>
                <li>
                  <div className="font-medium">Enter the configuration values below</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Copy each value from your Firebase configuration into the corresponding field:
                  </p>
                </li>
              </ol>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("enable")}>
                Previous Step
              </Button>
              <Button onClick={() => setActiveTab("test")}>
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Firebase Connection</CardTitle>
              <CardDescription>Enter your Firebase configuration details and test the connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "success" && (
                <div className="flex flex-col items-center mb-6">
                  <Image
                    src="/images/setup-success.png"
                    alt="Setup Success"
                    width={200}
                    height={200}
                    className="mb-4"
                  />
                  <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 w-full">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Firebase has been successfully initialized. Your configuration has been saved.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {status === "error" && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorMessage || "Failed to initialize Firebase. Please check your configuration."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyC..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authDomain">Auth Domain</Label>
                <Input
                  id="authDomain"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="your-app.firebaseapp.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="your-project-id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageBucket">Storage Bucket</Label>
                <Input
                  id="storageBucket"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="your-app.appspot.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
                <Input
                  id="messagingSenderId"
                  value={messagingSenderId}
                  onChange={(e) => setMessagingSenderId(e.target.value)}
                  placeholder="123456789012"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appId">App ID</Label>
                <Input
                  id="appId"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456789012:web:abc123def456"
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Next Steps</h3>
                <p className="text-sm text-muted-foreground">
                  After testing your connection, you'll need to add these values to your environment variables:
                </p>
                <ol className="list-decimal pl-5 mt-2 text-sm space-y-2">
                  <li>
                    Create a <code>.env.local</code> file in your project root if it doesn't exist
                  </li>
                  <li>Click the "Copy as .env" button below to copy the environment variables to your clipboard</li>
                  <li>
                    Paste the variables into your <code>.env.local</code> file
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4 justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveTab("config")}>
                  Previous Step
                </Button>
                <Button variant="outline" onClick={handleCopyEnv}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy as .env
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleTest} disabled={status === "testing"}>
                  {status === "testing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
                {status === "success" && (
                  <Button variant="default" asChild>
                    <Link href="/auth/sign-up">
                      Continue to Sign Up
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Setting Up Firebase Admin SDK (Optional)</CardTitle>
          <CardDescription>For server-side authentication verification and advanced features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            The Firebase Admin SDK allows you to perform server-side operations like verifying ID tokens, managing
            users, and accessing Firestore with admin privileges. This is optional but recommended for secure
            server-side operations.
          </p>

          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <div className="font-medium">Generate a new private key</div>
              <p className="text-sm text-muted-foreground mt-1">
                In your Firebase project settings, go to the "Service accounts" tab and click "Generate new private
                key".
              </p>
            </li>
            <li>
              <div className="font-medium">Save the JSON file</div>
              <p className="text-sm text-muted-foreground mt-1">
                Download and securely store the JSON file containing your service account credentials.
              </p>
            </li>
            <li>
              <div className="font-medium">Add environment variables</div>
              <p className="text-sm text-muted-foreground mt-1">
                Add the following environment variables to your <code>.env.local</code> file:
              </p>
              <pre className="bg-muted p-3 rounded-md text-xs mt-2 overflow-auto">
                {`FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\
Your private key here\
-----END PRIVATE KEY-----\
"`}
              </pre>
            </li>
          </ol>

          <div className="rounded-md bg-muted p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Security Note</h3>
                <div className="mt-2 text-sm">
                  <p>
                    Never commit your Firebase Admin SDK private key to version control. Always use environment
                    variables or secrets management for sensitive credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

