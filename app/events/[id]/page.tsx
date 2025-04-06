"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Share2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
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

export default function EventPage({ params }: { params: { id: string } }) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [attendees, setAttendees] = useState(120)
  const [spotsAvailable, setSpotsAvailable] = useState(30)

  // In a real app, you would fetch the event data based on the ID
  const event = {
    id: params.id,
    title: "Tech Innovation Summit",
    description:
      "Join industry leaders and academics to explore the latest in technology innovation. This summit will feature keynote speeches, panel discussions, and workshops on emerging technologies such as artificial intelligence, blockchain, and quantum computing.",
    longDescription: `
      <p>The Tech Innovation Summit is a premier event that brings together industry leaders, academics, and students to explore the latest advancements in technology.</p>
      
      <p>This year's summit will focus on:</p>
      <ul>
        <li>Artificial Intelligence and Machine Learning</li>
        <li>Blockchain Technology and Applications</li>
        <li>Quantum Computing</li>
        <li>Cybersecurity Challenges</li>
        <li>Future of EdTech</li>
      </ul>
      
      <p>The event will feature keynote speeches from renowned experts, panel discussions on current trends, and interactive workshops where participants can gain hands-on experience with cutting-edge technologies.</p>
      
      <p>Don't miss this opportunity to network with professionals, learn from experts, and stay ahead of the technological curve!</p>
    `,
    date: "March 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium",
    organizer: "Computer Science Department",
    category: "Academic",
    image: "/placeholder.svg?height=400&width=800",
    speakers: [
      {
        name: "Dr. Sarah Johnson",
        title: "AI Research Lead, Tech Innovations Inc.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Prof. Michael Chen",
        title: "Quantum Computing Expert, Nile University",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Eng. Amina Hassan",
        title: "Blockchain Developer, Future Technologies",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
    schedule: [
      {
        time: "9:00 AM - 10:00 AM",
        title: "Registration and Networking",
        location: "Main Lobby",
      },
      {
        time: "10:00 AM - 11:30 AM",
        title: "Keynote: The Future of AI in Education",
        speaker: "Dr. Sarah Johnson",
        location: "Main Auditorium",
      },
      {
        time: "11:45 AM - 1:00 PM",
        title: "Panel Discussion: Emerging Technologies",
        location: "Main Auditorium",
      },
      {
        time: "1:00 PM - 2:00 PM",
        title: "Lunch Break",
        location: "Cafeteria",
      },
      {
        time: "2:00 PM - 3:30 PM",
        title: "Workshop Sessions (Multiple Tracks)",
        location: "Various Rooms",
      },
      {
        time: "3:45 PM - 4:45 PM",
        title: "Closing Keynote: Building the Future",
        speaker: "Prof. Michael Chen",
        location: "Main Auditorium",
      },
      {
        time: "4:45 PM - 5:00 PM",
        title: "Closing Remarks",
        location: "Main Auditorium",
      },
    ],
  }

  const handleRegister = () => {
    if (!isRegistered && spotsAvailable > 0) {
      setIsRegistered(true)
      setAttendees(attendees + 1)
      setSpotsAvailable(spotsAvailable - 1)
      // In a real app, you would make an API call to register the user
    }
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
            <Link href="/events" className="text-sm font-medium text-primary">
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
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[300px] md:h-[400px]">
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge className="mb-2">{event.category}</Badge>
            <h1 className="text-3xl font-bold text-white md:text-4xl">{event.title}</h1>
          </div>
        </div>
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="speakers">Speakers</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="space-y-4">
                  <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: event.longDescription }}
                  />
                </TabsContent>
                <TabsContent value="schedule" className="space-y-4">
                  <h2 className="text-2xl font-bold">Event Schedule</h2>
                  <div className="space-y-4">
                    {event.schedule.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              {item.speaker && <p className="text-sm text-gray-500">Speaker: {item.speaker}</p>}
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <MapPin className="mr-1 h-4 w-4" />
                                {item.location}
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <Badge variant="outline">{item.time}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="speakers" className="space-y-4">
                  <h2 className="text-2xl font-bold">Speakers</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {event.speakers.map((speaker, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                              <AvatarImage src={speaker.avatar} alt={speaker.name} />
                              <AvatarFallback>{speaker.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold">{speaker.name}</h3>
                            <p className="text-sm text-gray-500">{speaker.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CalendarDays className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Date</h3>
                        <p className="text-sm text-gray-500">{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Time</h3>
                        <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Attendees</h3>
                        <p className="text-sm text-gray-500">
                          {attendees} registered
                          {spotsAvailable > 0 && (
                            <span className="ml-1 text-muted-foreground">• {spotsAvailable} spots left</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Organized by</h3>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>CS</AvatarFallback>
                        </Avatar>
                        <span>{event.organizer}</span>
                      </div>
                    </div>
                    <Separator />
                    {isRegistered ? (
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
                                Registration confirmed
                              </h3>
                              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                                <p>You're registered for this event. We've sent the details to your email.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline">
                          Add to Calendar
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={handleRegister} disabled={spotsAvailable === 0}>
                        {spotsAvailable > 0 ? "Register for Event" : "Event Full"}
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share this event</DialogTitle>
                          <DialogDescription>Share this event with your friends and colleagues</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="share-link">Event Link</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="share-link"
                                defaultValue={`https://nileuniversity.edu/events/${event.id}`}
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

