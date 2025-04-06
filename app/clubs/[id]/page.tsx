"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Share2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ClubPage({ params }: { params: { id: string } }) {
  const [isMember, setIsMember] = useState(false)

  // In a real app, you would fetch the club data based on the ID
  const club = {
    id: params.id,
    name: "Tech Club",
    description: "For students passionate about technology and innovation",
    longDescription: `
      <p>The Tech Club at Nile University is a vibrant community of tech enthusiasts, innovators, and problem solvers. We are dedicated to fostering a culture of technological innovation and providing a platform for students to enhance their technical skills.</p>
      
      <p>Our mission is to:</p>
      <ul>
        <li>Create a collaborative environment for students interested in technology</li>
        <li>Organize workshops, hackathons, and tech talks</li>
        <li>Connect students with industry professionals</li>
        <li>Provide hands-on experience with the latest technologies</li>
        <li>Support student-led tech projects and initiatives</li>
      </ul>
      
      <p>Whether you're a coding expert or just starting your tech journey, the Tech Club welcomes members of all skill levels. Join us to learn, collaborate, and innovate!</p>
    `,
    category: "Academic",
    members: 120,
    founded: "2018",
    meetingSchedule: "Every Wednesday, 4:00 PM - 6:00 PM",
    location: "Computer Science Building, Room 201",
    image: "/placeholder.svg?height=400&width=800",
    leaders: [
      {
        name: "Ahmed Hassan",
        role: "President",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Fatima Ali",
        role: "Vice President",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Omar Mahmoud",
        role: "Secretary",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
    upcomingEvents: [
      {
        title: "Web Development Workshop",
        date: "March 18, 2025",
        time: "4:00 PM - 6:00 PM",
        location: "Computer Lab 3",
      },
      {
        title: "Tech Talk: AI in Healthcare",
        date: "March 25, 2025",
        time: "5:00 PM - 7:00 PM",
        location: "Main Auditorium",
      },
      {
        title: "Hackathon 2025",
        date: "April 5-6, 2025",
        time: "9:00 AM - 9:00 PM",
        location: "Innovation Hub",
      },
    ],
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
  }

  const handleJoinClub = () => {
    setIsMember(true)
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
            <Link href="/clubs" className="text-sm font-medium text-primary">
              Clubs
            </Link>
            <Link href="/my-activities" className="text-sm font-medium">
              My Activities
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[300px] md:h-[400px]">
          <img src={club.image || "/placeholder.svg"} alt={club.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge className="mb-2">{club.category}</Badge>
            <h1 className="text-3xl font-bold text-white md:text-4xl">{club.name}</h1>
          </div>
        </div>
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="space-y-4">
                  <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: club.longDescription }}
                  />

                  <h2 className="text-2xl font-bold mt-8">Club Leaders</h2>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {club.leaders.map((leader, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                              <AvatarImage src={leader.avatar} alt={leader.name} />
                              <AvatarFallback>{leader.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold">{leader.name}</h3>
                            <p className="text-sm text-gray-500">{leader.role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="events" className="space-y-4">
                  <h2 className="text-2xl font-bold">Upcoming Events</h2>
                  <div className="space-y-4">
                    {club.upcomingEvents.map((event, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 opacity-70" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 opacity-70" />
                            <span>{event.location}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="members" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Club Members</h2>
                    <div className="relative">
                      <Input type="search" placeholder="Search members..." className="w-[200px]" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${index + 1}`} />
                          <AvatarFallback>U{index + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">User {index + 1}</p>
                          <p className="text-sm text-gray-500">{index < 3 ? "Executive Member" : "Member"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline">View All Members</Button>
                  </div>
                </TabsContent>
                <TabsContent value="gallery" className="space-y-4">
                  <h2 className="text-2xl font-bold">Photo Gallery</h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {club.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Gallery image ${index + 1}`}
                        className="aspect-video rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Club Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CalendarDays className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Founded</h3>
                        <p className="text-sm text-gray-500">{club.founded}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Meeting Schedule</h3>
                        <p className="text-sm text-gray-500">{club.meetingSchedule}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-sm text-gray-500">{club.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Members</h3>
                        <p className="text-sm text-gray-500">{club.members} members</p>
                      </div>
                    </div>
                    <Separator />
                    {isMember ? (
                      <div className="space-y-4">
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
                                You are a member
                              </h3>
                              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                                <p>You've successfully joined this club.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline">
                          View Club Chat
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={handleJoinClub}>
                        Join Club
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Club
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share this club</DialogTitle>
                          <DialogDescription>Share this club with your friends and colleagues</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="share-link">Club Link</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="share-link"
                                defaultValue={`https://nileuniversity.edu/clubs/${club.id}`}
                                readOnly
                              />
                              <Button variant="outline" size="sm">
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-center gap-4">
                            <Button variant="outline" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 text-[#1877F2]"
                              >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                              </svg>
                              <span className="sr-only">Share on Facebook</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 text-[#1DA1F2]"
                              >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                              <span className="sr-only">Share on Twitter</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 text-[#0A66C2]"
                              >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect width="4" height="12" x="2" y="9"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                              </svg>
                              <span className="sr-only">Share on LinkedIn</span>
                            </Button>
                            <Button variant="outline" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 text-[#25D366]"
                              >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                              <span className="sr-only">Share via WhatsApp</span>
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" className="w-full">
                            Done
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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

