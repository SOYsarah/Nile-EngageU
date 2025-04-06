"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function PreferencesPage() {
  const [requestSent, setRequestSent] = useState(false)

  const handleRequestCertificate = () => {
    setRequestSent(true)
    // In a real app, you would make an API call to submit the request
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold">
              Nile University Events
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/events" className="text-sm font-medium">
              Events
            </Link>
            <Link href="/clubs" className="text-sm font-medium">
              Clubs
            </Link>
            <Link href="/my-activities" className="text-sm font-medium">
              My Activities
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>NU</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profile Preferences</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your notifications and participation tracking</p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="hidden md:block">
              <nav className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/profile/preferences"
                  className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 font-medium"
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
                  <CardTitle>Interest Preferences</CardTitle>
                  <CardDescription>
                    Choose which types of events you're interested in to receive personalized notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Event Categories</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox id={`category-${category.id}`} defaultChecked={category.defaultChecked} />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Club Interests</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {clubs.map((club) => (
                        <div key={club.id} className="flex items-center space-x-2">
                          <Checkbox id={`club-${club.id}`} defaultChecked={club.defaultChecked} />
                          <Label
                            htmlFor={`club-${club.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {club.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Save Preferences</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications about campus activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="upcoming-events">Upcoming Events</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about events starting soon</p>
                    </div>
                    <Switch id="upcoming-events" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-events">New Events</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified when new events matching your interests are posted
                      </p>
                    </div>
                    <Switch id="new-events" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="registration-deadline">Registration Deadlines</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about registration deadlines for saved events
                      </p>
                    </div>
                    <Switch id="registration-deadline" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="club-updates">Club Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive updates from clubs you're a member of</p>
                    </div>
                    <Switch id="club-updates" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Notification Settings</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participation Tracking</CardTitle>
                  <CardDescription>Request documentation of your participation in campus activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-start">
                        <div className="mr-4 mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">Request Participation Documentation</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Request an official record of your campus activities participation for your portfolio, job
                            applications, or future educational opportunities.
                          </p>
                          <div className="mt-4">
                            {requestSent ? (
                              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                                      Request Submitted
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                                      <p>
                                        Your participation documentation request has been submitted and is under review.
                                        You will be notified when it's ready.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Button onClick={handleRequestCertificate}>Request Documentation</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-md border p-4">
                      <div>
                        <h4 className="text-sm font-semibold">Previous Requests</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          View and download your previously requested participation documentation
                        </p>
                      </div>
                      <Button variant="outline">View History</Button>
                    </div>
                  </div>
                </CardContent>
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

// Sample data
const categories = [
  { id: 1, name: "Academic Events", defaultChecked: true },
  { id: 2, name: "Social Events", defaultChecked: true },
  { id: 3, name: "Sports Events", defaultChecked: false },
  { id: 4, name: "Cultural Events", defaultChecked: true },
  { id: 5, name: "Career Events", defaultChecked: true },
  { id: 6, name: "Workshops", defaultChecked: false },
  { id: 7, name: "Competitions", defaultChecked: true },
  { id: 8, name: "Volunteer Opportunities", defaultChecked: false },
]

const clubs = [
  { id: 1, name: "Tech Club", defaultChecked: true },
  { id: 2, name: "Drama Society", defaultChecked: false },
  { id: 3, name: "Sports Association", defaultChecked: false },
  { id: 4, name: "Debate Club", defaultChecked: true },
  { id: 5, name: "Music Band", defaultChecked: false },
  { id: 6, name: "Environmental Club", defaultChecked: true },
  { id: 7, name: "Photography Club", defaultChecked: false },
  { id: 8, name: "Entrepreneurship Club", defaultChecked: true },
]

