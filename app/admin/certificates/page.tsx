import Link from "next/link"
import { CheckCircle, Download, FileText, Search, Send, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin/admin-header"

export default function CertificatesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Participation Certificates</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage participation tracking and documentation requests
              </p>
            </div>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate New Certificate
            </Button>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="pending">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="pending">
                    Pending Requests
                    <Badge className="ml-2 bg-amber-500 text-white" variant="secondary">
                      16
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved
                    <Badge className="ml-2" variant="secondary">
                      42
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected
                    <Badge className="ml-2" variant="secondary">
                      5
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input type="search" placeholder="Search requests..." className="pl-8 w-[250px]" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="semester">Semester Report</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="clubs">Club Participation</SelectItem>
                      <SelectItem value="volunteer">Volunteer Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="pending" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Certificate Requests</CardTitle>
                    <CardDescription>
                      Review and process student requests for participation documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="rounded-lg border p-4">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={request.avatar} alt={request.name} />
                                <AvatarFallback>{request.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{request.name}</h3>
                                <p className="text-sm text-muted-foreground">{request.email}</p>
                                <div className="mt-1 flex items-center">
                                  <Badge variant="outline">{request.type}</Badge>
                                  <span className="ml-2 text-xs text-muted-foreground">Requested: {request.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" className="gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1">
                                <FileText className="h-4 w-4" />
                                Preview
                              </Button>
                              <Button size="sm" variant="secondary" className="gap-1">
                                <Send className="h-4 w-4" />
                                Send Certificate
                              </Button>
                              <Button size="sm" variant="destructive" className="gap-1">
                                <XCircle className="h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div>
                            <h4 className="text-sm font-semibold">Request Details</h4>
                            <p className="mt-1 text-sm">{request.details}</p>
                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                              <div className="rounded-md bg-muted p-3">
                                <div className="text-xs font-semibold uppercase text-muted-foreground">
                                  Events Attended
                                </div>
                                <div className="mt-1 text-lg font-bold">{request.stats.events}</div>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <div className="text-xs font-semibold uppercase text-muted-foreground">
                                  Club Meetings
                                </div>
                                <div className="mt-1 text-lg font-bold">{request.stats.meetings}</div>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <div className="text-xs font-semibold uppercase text-muted-foreground">
                                  Volunteer Hours
                                </div>
                                <div className="mt-1 text-lg font-bold">{request.stats.volunteering}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Previous</Button>
                    <div className="text-sm text-muted-foreground">Showing 1-5 of 16 requests</div>
                    <Button>Next</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="approved" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Approved Certificates</CardTitle>
                    <CardDescription>Certificates that have been generated and sent to students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {approvedRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={request.avatar} alt={request.name} />
                              <AvatarFallback>{request.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{request.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{request.type}</Badge>
                                <span className="text-xs text-muted-foreground">Approved: {request.approvedDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="gap-1">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                            <Button size="sm" variant="secondary" className="gap-1">
                              <Send className="h-4 w-4" />
                              Resend
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Previous</Button>
                    <div className="text-sm text-muted-foreground">Showing 1-5 of 42 certificates</div>
                    <Button>Next</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rejected Requests</CardTitle>
                    <CardDescription>Certificate requests that have been rejected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rejectedRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={request.avatar} alt={request.name} />
                              <AvatarFallback>{request.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{request.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{request.type}</Badge>
                                <span className="text-xs text-muted-foreground">Rejected: {request.rejectedDate}</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">Reason: {request.reason}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Reconsider
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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

// Sample data
const pendingRequests = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed.mohamed@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Semester Participation Report",
    date: "March 9, 2025",
    details:
      "Requesting documentation of all academic events attended and club meetings for the Spring 2025 semester for my portfolio.",
    stats: {
      events: 12,
      meetings: 18,
      volunteering: 24,
    },
  },
  {
    id: 2,
    name: "Fatima Ali",
    email: "fatima.ali@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Leadership Certificate",
    date: "March 8, 2025",
    details:
      "Need documentation of my leadership roles in student clubs and events organized during my time as Club President.",
    stats: {
      events: 15,
      meetings: 24,
      volunteering: 30,
    },
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar.hassan@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Club Participation Records",
    date: "March 7, 2025",
    details:
      "Requesting records of my participation in the Tech Club activities for the past two semesters for my internship application.",
    stats: {
      events: 8,
      meetings: 14,
      volunteering: 0,
    },
  },
  {
    id: 4,
    name: "Layla Ibrahim",
    email: "layla.ibrahim@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Volunteer Hours Certificate",
    date: "March 6, 2025",
    details:
      "Need documentation of completed volunteer hours for my scholarship application, particularly for community service events.",
    stats: {
      events: 6,
      meetings: 0,
      volunteering: 45,
    },
  },
  {
    id: 5,
    name: "Yousef Mahmoud",
    email: "yousef.mahmoud@nileuniversity.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Sports Participation Certificate",
    date: "March 5, 2025",
    details:
      "Requesting certification of my participation in university sports tournaments as team captain for graduate school application.",
    stats: {
      events: 10,
      meetings: 12,
      volunteering: 8,
    },
  },
]

const approvedRequests = [
  {
    id: 1,
    name: "Nour Ahmed",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Leadership Certificate",
    approvedDate: "March 4, 2025",
  },
  {
    id: 2,
    name: "Youssef Mahmoud",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Community Service Hours",
    approvedDate: "March 3, 2025",
  },
  {
    id: 3,
    name: "Sara Khalid",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Academic Events Participation",
    approvedDate: "March 2, 2025",
  },
  {
    id: 4,
    name: "Mohamed Ali",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Club Leadership Record",
    approvedDate: "March 1, 2025",
  },
  {
    id: 5,
    name: "Amina Rahman",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Volunteer Hours Certificate",
    approvedDate: "February 28, 2025",
  },
]

const rejectedRequests = [
  {
    id: 1,
    name: "Ibrahim Ahmed",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Leadership Certificate",
    rejectedDate: "March 4, 2025",
    reason: "Insufficient leadership role evidence",
  },
  {
    id: 2,
    name: "Hana Mahmoud",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Sports Participation",
    rejectedDate: "March 3, 2025",
    reason: "Attendance below minimum requirement",
  },
  {
    id: 3,
    name: "Karim Said",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "Academic Events Participation",
    rejectedDate: "March 1, 2025",
    reason: "Missing verification from event organizers",
  },
]

