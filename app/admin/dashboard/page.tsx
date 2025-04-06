import Link from "next/link"
import { CheckCircle, Clock, Download, FileText, PieChart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage campus activities and user participation</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">8 upcoming this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Participation Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">16</div>
                <p className="text-xs text-muted-foreground">6 new requests today</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Participation Tracking Requests</CardTitle>
                <CardDescription>Students requesting documentation of their participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {participationRequests.map((request) => (
                    <div key={request.id} className="flex items-start justify-between border-b pb-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={request.avatar} alt={request.name} />
                          <AvatarFallback>{request.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Request Type:</span> {request.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Requested:</span> {request.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="h-8 gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Requests
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Event Participation Overview</CardTitle>
                <CardDescription>Breakdown of user participation across event categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm font-medium">{category.count} events</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${category.participation}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{category.participation}% participation rate</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <PieChart className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Certificate Generation</CardTitle>
                <CardDescription>Recently approved and generated participation certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCertificates.map((certificate) => (
                    <div key={certificate.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={certificate.avatar} alt={certificate.student} />
                          <AvatarFallback>{certificate.student.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{certificate.student}</p>
                          <p className="text-sm text-muted-foreground">{certificate.type}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Generated on {certificate.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 gap-1">
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Certificates
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Nile University Events</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Dashboard for Campus Activities</p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium">
              Help
            </Link>
            <Link href="#" className="text-sm font-medium">
              Settings
            </Link>
            <Link href="#" className="text-sm font-medium">
              Logout
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

import { CalendarDays } from "lucide-react"

// Sample data
const participationRequests = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed.mohamed@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Semester Participation Report",
    date: "March 9, 2025",
  },
  {
    id: 2,
    name: "Fatima Ali",
    email: "fatima.ali@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Leadership Certificate",
    date: "March 8, 2025",
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar.hassan@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Club Participation Records",
    date: "March 7, 2025",
  },
  {
    id: 4,
    name: "Layla Ibrahim",
    email: "layla.ibrahim@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Volunteer Hours Certificate",
    date: "March 6, 2025",
  },
]

const eventCategories = [
  {
    name: "Academic",
    count: 18,
    participation: 78,
  },
  {
    name: "Social",
    count: 12,
    participation: 65,
  },
  {
    name: "Sports",
    count: 9,
    participation: 85,
  },
  {
    name: "Cultural",
    count: 7,
    participation: 72,
  },
]

const recentCertificates = [
  {
    id: 1,
    student: "Nour Ahmed",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Leadership Certificate",
    date: "March 8, 2025",
  },
  {
    id: 2,
    student: "Youssef Mahmoud",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Community Service Hours",
    date: "March 7, 2025",
  },
  {
    id: 3,
    student: "Sara Khalid",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Academic Events Participation",
    date: "March 6, 2025",
  },
]

