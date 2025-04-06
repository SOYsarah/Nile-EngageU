import Link from "next/link"
import { Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"

export default function ClubsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Clubs</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Join student clubs and organizations to enhance your university experience
              </p>
            </div>
            <Button>Start a New Club</Button>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input type="search" placeholder="Search clubs..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="popular">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Clubs</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="cultural">Cultural</TabsTrigger>
                <TabsTrigger value="sports">Sports</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs.map((club, index) => (
                    <ClubCard key={index} club={club} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="academic">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs
                    .filter((club) => club.category === "Academic")
                    .map((club, index) => (
                      <ClubCard key={index} club={club} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="cultural">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs
                    .filter((club) => club.category === "Cultural")
                    .map((club, index) => (
                      <ClubCard key={index} club={club} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="sports">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs
                    .filter((club) => club.category === "Sports")
                    .map((club, index) => (
                      <ClubCard key={index} club={club} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="social">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs
                    .filter((club) => club.category === "Social")
                    .map((club, index) => (
                      <ClubCard key={index} club={club} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
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

function ClubCard({ club }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt={club.name} />
            <AvatarFallback>{club.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{club.name}</CardTitle>
            <Badge variant="outline" className="mt-1">
              {club.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{club.description}</CardDescription>
        <div className="mt-4 flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 opacity-70" />
          <span>{club.members} members</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Learn More</Button>
        <Button>Join Club</Button>
      </CardFooter>
    </Card>
  )
}

const clubs = [
  {
    name: "Tech Club",
    description:
      "For students passionate about technology and innovation. We organize workshops, hackathons, and tech talks to help members enhance their technical skills and stay updated with the latest trends in technology.",
    category: "Academic",
    members: 120,
  },
  {
    name: "Drama Society",
    description:
      "Express yourself through the art of theater and performance. We produce plays, organize acting workshops, and participate in drama competitions both within and outside the university.",
    category: "Cultural",
    members: 85,
  },
  {
    name: "Sports Association",
    description:
      "Participate in various sports activities and competitions. We organize regular training sessions, friendly matches, and represent the university in inter-university tournaments.",
    category: "Sports",
    members: 200,
  },
  {
    name: "Debate Club",
    description:
      "Enhance your public speaking and critical thinking skills through debates on various topics. We participate in national and international debate competitions.",
    category: "Academic",
    members: 75,
  },
  {
    name: "Music Band",
    description:
      "For students who are passionate about music. We perform at university events, organize concerts, and provide a platform for musically talented students to showcase their skills.",
    category: "Cultural",
    members: 50,
  },
  {
    name: "Environmental Club",
    description:
      "Dedicated to promoting environmental awareness and sustainability. We organize clean-up drives, tree planting activities, and awareness campaigns on environmental issues.",
    category: "Social",
    members: 90,
  },
  {
    name: "Photography Club",
    description:
      "Explore the art of photography and visual storytelling. We organize photo walks, workshops on photography techniques, and exhibitions to showcase members' work.",
    category: "Cultural",
    members: 65,
  },
  {
    name: "Entrepreneurship Club",
    description:
      "For aspiring entrepreneurs who want to develop their business ideas. We organize workshops, mentorship programs, and startup competitions to help members launch their ventures.",
    category: "Academic",
    members: 110,
  },
  {
    name: "Basketball Team",
    description:
      "Join our basketball team to improve your skills and represent the university in competitions. We have regular training sessions and participate in inter-university tournaments.",
    category: "Sports",
    members: 30,
  },
  {
    name: "Volunteer Corps",
    description:
      "Dedicated to community service and social impact. We organize volunteer activities, charity events, and outreach programs to help those in need.",
    category: "Social",
    members: 150,
  },
  {
    name: "Chess Club",
    description:
      "For chess enthusiasts of all skill levels. We organize regular practice sessions, tournaments, and provide coaching to help members improve their game.",
    category: "Sports",
    members: 40,
  },
  {
    name: "Literary Society",
    description:
      "For students who love reading and writing. We organize book discussions, writing workshops, and publish a university literary magazine featuring members' work.",
    category: "Cultural",
    members: 70,
  },
]

