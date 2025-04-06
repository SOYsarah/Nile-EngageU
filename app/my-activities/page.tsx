"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, CheckCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"

export default function MyActivitiesPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Activities</h1>
              <p className="text-gray-500 dark:text-gray-400">Track your participation in campus events and clubs</p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                  <TabsTrigger value="clubs">My Clubs</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={index} event={event} isUpcoming={true} />
                  ))}
                </TabsContent>
                <TabsContent value="past" className="space-y-4">
                  {pastEvents.map((event, index) => (
                    <EventCard key={index} event={event} isUpcoming={false} />
                  ))}
                </TabsContent>
                <TabsContent value="clubs" className="space-y-4">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {myClubs.map((club, index) => (
                      <ClubCard key={index} club={club} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Participation Summary</CardTitle>
                  <CardDescription>Your activity statistics for this semester</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Events Attended</span>
                      <span className="text-sm font-medium">8/15</span>
                    </div>
                    <Progress value={53} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Club Meetings</span>
                      <span className="text-sm font-medium">12/20</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Volunteer Hours</span>
                      <span className="text-sm font-medium">15/30</span>
                    </div>
                    <Progress value={50} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Leadership Points</span>
                      <span className="text-sm font-medium">75/100</span>
                    </div>
                    <Progress value={75} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download Certificate
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Project Submission</h3>
                      <p className="text-sm text-gray-500">Tech Club - March 18, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                      <Clock className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Registration Deadline</h3>
                      <p className="text-sm text-gray-500">Career Fair - March 25, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Volunteer Application</h3>
                      <p className="text-sm text-gray-500">Charity Run - April 1, 2025</p>
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

function EventCard({ event, isUpcoming }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <Badge className="mb-2">{event.category}</Badge>
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{event.description}</p>
              </div>
              {!isUpcoming && event.attended && (
                <div className="mt-4 flex items-center md:mt-0">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Attended
                  </Badge>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
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
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              {isUpcoming ? (
                <>
                  <Button variant="outline" size="sm">
                    Cancel Registration
                  </Button>
                  <Button size="sm">View Details</Button>
                </>
              ) : (
                <>
                  {event.hasCertificate && (
                    <Button variant="outline" size="sm">
                      Download Certificate
                    </Button>
                  )}
                  <Button size="sm">View Details</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ClubCard({ club }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={club.image} alt={club.name} />
            <AvatarFallback>{club.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{club.name}</CardTitle>
            <Badge variant="outline" className="mt-1">
              {club.role}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">{club.description}</p>
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>Attendance</span>
            <span>
              {club.attendance.current}/{club.attendance.total} meetings
            </span>
          </div>
          <Progress value={(club.attendance.current / club.attendance.total) * 100} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Schedule
        </Button>
        <Button size="sm">Club Page</Button>
      </CardFooter>
    </Card>
  )
}

const upcomingEvents = [
  {
    title: "Tech Innovation Summit",
    description: "Join industry leaders and academics to explore the latest in technology innovation.",
    date: "March 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium",
    category: "Academic",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Annual Sports Festival",
    description: "Compete in various sports activities and represent your department.",
    date: "March 20, 2025",
    time: "10:00 AM - 6:00 PM",
    location: "Sports Complex",
    category: "Sports",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Career Fair 2025",
    description: "Meet potential employers and explore career opportunities in various industries.",
    date: "April 10, 2025",
    time: "11:00 AM - 4:00 PM",
    location: "Exhibition Hall",
    category: "Academic",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const pastEvents = [
  {
    title: "Leadership Workshop",
    description: "Learn essential leadership skills from industry professionals.",
    date: "February 15, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Business School",
    category: "Academic",
    attended: true,
    hasCertificate: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Cultural Festival",
    description: "Celebrate diversity through music, dance, and food from different cultures.",
    date: "February 5, 2025",
    time: "4:00 PM - 9:00 PM",
    location: "Student Center",
    category: "Social",
    attended: true,
    hasCertificate: false,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Hackathon 2025",
    description: "Collaborate with fellow students to solve real-world problems through technology.",
    date: "January 20, 2025",
    time: "9:00 AM - 9:00 PM",
    location: "Computer Science Building",
    category: "Academic",
    attended: true,
    hasCertificate: true,
    image: "/placeholder.svg?height=200&width=300",
  },
]

const myClubs = [
  {
    name: "Tech Club",
    description: "For students passionate about technology and innovation",
    role: "Member",
    attendance: {
      current: 8,
      total: 10,
    },
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Debate Society",
    description: "Enhance your public speaking and critical thinking skills",
    role: "Secretary",
    attendance: {
      current: 12,
      total: 15,
    },
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Photography Club",
    description: "Explore the art of photography and visual storytelling",
    role: "Member",
    attendance: {
      current: 6,
      total: 8,
    },
    image: "/placeholder.svg?height=48&width=48",
  },
]

