import Link from "next/link"
import { Download, FileText, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function CertificatesPage() {
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
              <h1 className="text-3xl font-bold">My Certificates</h1>
              <p className="text-gray-500 dark:text-gray-400">View and download your participation records</p>
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Preferences
                </Link>
                <Link
                  href="/profile/certificates"
                  className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Certificates
                </Link>
              </nav>
            </div>
            <div className="space-y-8">
              <Tabs defaultValue="certificates">
                <TabsList>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  <TabsTrigger value="requests">
                    Pending Requests
                    <Badge className="ml-2" variant="secondary">
                      1
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="certificates" className="mt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {certificates.map((certificate) => (
                      <Card key={certificate.id}>
                        <CardHeader className="pb-2">
                          <CardTitle>{certificate.title}</CardTitle>
                          <CardDescription>{certificate.period}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-start gap-4">
                            <div className="rounded-full bg-primary/10 p-2">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">Type:</span> {certificate.type}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Issued:</span> {certificate.issued}
                              </p>
                              <div className="mt-2">
                                <Badge variant="outline">{certificate.status}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download Certificate
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="requests" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Documentation Requests</CardTitle>
                      <CardDescription>Track the status of your participation documentation requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingRequests.map((request) => (
                          <div key={request.id} className="rounded-lg border p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="font-semibold">{request.type}</h3>
                                <p className="text-sm text-muted-foreground">Requested: {request.date}</p>
                                <div className="mt-2 flex items-center">
                                  <Badge
                                    className={
                                      request.status === "Under Review"
                                        ? "bg-amber-500 text-white"
                                        : request.status === "Processing"
                                          ? "bg-blue-500 text-white"
                                          : ""
                                    }
                                  >
                                    {request.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                            {request.message && (
                              <div className="mt-4 rounded-md bg-muted p-3">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Admin Message</h4>
                                <p className="mt-1 text-sm">{request.message}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>Semester Participation Summary</CardTitle>
                  <CardDescription>Overview of your campus engagement for Spring 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-md bg-muted p-4">
                      <div className="text-2xl font-bold">15</div>
                      <div className="text-sm font-medium text-muted-foreground">Events Attended</div>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <span className="font-medium">8</span> Academic
                        <br />
                        <span className="font-medium">4</span> Social
                        <br />
                        <span className="font-medium">3</span> Cultural
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-sm font-medium text-muted-foreground">Club Meetings</div>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <span className="font-medium">14</span> Tech Club
                        <br />
                        <span className="font-medium">6</span> Debate Club
                        <br />
                        <span className="font-medium">4</span> Environmental Club
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <div className="text-2xl font-bold">32</div>
                      <div className="text-sm font-medium text-muted-foreground">Volunteer Hours</div>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <span className="font-medium">12</span> Community Service
                        <br />
                        <span className="font-medium">10</span> Event Organization
                        <br />
                        <span className="font-medium">10</span> Mentorship
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Request Full Report
                  </Button>
                </CardFooter>
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
const certificates = [
  {
    id: 1,
    title: "Leadership Certificate",
    period: "Fall 2024",
    type: "Club Leadership",
    issued: "December 15, 2024",
    status: "Verified",
  },
  {
    id: 2,
    title: "Community Service Certificate",
    period: "Summer 2024",
    type: "Volunteer Hours",
    issued: "August 30, 2024",
    status: "Verified",
  },
  {
    id: 3,
    title: "Academic Participation",
    period: "Spring 2024",
    type: "Event Attendance",
    issued: "May 25, 2024",
    status: "Verified",
  },
  {
    id: 4,
    title: "Sports Achievement Certificate",
    period: "Winter 2023",
    type: "Sports Events",
    issued: "January 10, 2024",
    status: "Verified",
  },
]

const pendingRequests = [
  {
    id: 1,
    type: "Semester Participation Report - Spring 2025",
    date: "March 9, 2025",
    status: "Under Review",
    message: null,
  },
]

