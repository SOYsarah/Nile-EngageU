import Link from "next/link"
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SiteHeader } from "@/components/site-header"
import { AuthStatusIndicator } from "@/components/auth-status-indicator"
import { CampusLifeSection } from "@/components/campus-life-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="inline-flex mb-3">New Platform</Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect, Engage, Thrive
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Discover campus events, join clubs, and track your participation in one modern platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/events">
                      Browse Events
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/events/create">Create Event</Link>
                  </Button>
                </div>
              </div>
              <img
                src="/images/hp.jpg"
                width={550}
                height={550}
                alt="Students socializing in campus lounge"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Campus Life Section */}
        <CampusLifeSection />

        {/* Featured Events Section */}
        <section className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Events</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover and participate in exciting events happening around campus
                </p>
              </div>
            </div>
            <Tabs defaultValue="all" className="mt-8">
              <div className="flex justify-center">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all">All Events</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="sports">Sports</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <EventCard
                    title="Tech Innovation Summit"
                    description="Join industry leaders and academics to explore the latest in technology innovation."
                    date="March 15, 2025"
                    location="Main Auditorium"
                    attendees={120}
                    category="Academic"
                    image="images/tech.avif"
                  />
                  <EventCard
                    title="Annual Sports Festival"
                    description="Compete in various sports activities and represent your department."
                    date="March 20, 2025"
                    location="Sports Complex"
                    attendees={200}
                    category="Sports"
                    image="images/sport.webp"
                  />
                  <EventCard
                    title="Cultural Night"
                    description="Celebrate diversity through music, dance, and food from different cultures."
                    date="April 5, 2025"
                    location="Student Center"
                    attendees={150}
                    category="Social"
                    image="images/culture2.jpg"
                  />
                </div>
              </TabsContent>
              <TabsContent value="academic" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <EventCard
                    title="Tech Innovation Summit"
                    description="Join industry leaders and academics to explore the latest in technology innovation."
                    date="March 15, 2025"
                    location="Main Auditorium"
                    attendees={120}
                    image="images/tech.avif"
                  />
                </div>
              </TabsContent>
              <TabsContent value="social" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <EventCard
                    title="Cultural Night"
                    description="Celebrate diversity through music, dance, and food from different cultures."
                    date="April 5, 2025"
                    location="Student Center"
                    attendees={150}
                    category="Social"
                    image="images/culture2.jpg"
                  />
                </div>
              </TabsContent>
              <TabsContent value="sports" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <EventCard
                    title="Annual Sports Festival"
                    description="Compete in various sports activities and represent your department."
                    date="March 20, 2025"
                    location="Sports Complex"
                    attendees={200}
                    category="Sports"
                    image="images/sport.webp"
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-10 flex justify-center">
              <Button variant="outline" className="group" asChild>
                <Link href="/events">
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Clubs Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Popular Clubs</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join student clubs and organizations to enhance your university experience
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <ClubCard
                name="Tech Club"
                description="For students passionate about technology and innovation"
                members={120}
                category="Academic"
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-05%20at%206.26.02%20PM-OCKI3pFgT10PMCXeQae4N9atluQS9H.jpeg"
              />
              <ClubCard
                name="Drama Society"
                description="Express yourself through the art of theater and performance"
                members={85}
                category="Cultural"
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-05%20at%206.26.40%20PM-vCfEi2wp5iSPZotjGu06wVII0N0Z9b.jpeg"
              />
              <ClubCard
                name="Sports Association"
                description="Participate in various sports activities and competitions"
                members={200}
                category="Sports"
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-05%20at%206.26.14%20PM-D7FXQjGnwXnKIEICqJ5xmeGHyUk9n4.jpeg"
              />
            </div>
            <div className="flex justify-center">
              <Button variant="outline" className="group" asChild>
                <Link href="/clubs">
                  Explore All Clubs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
                  Create your account now and start exploring campus activities
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/sign-up">Sign Up Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
              </svg>
              <h3 className="text-lg font-bold">Nile Engage U</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting students with campus activities and opportunities.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </footer>

      {/* Add Auth status indicator for debugging */}
      <AuthStatusIndicator />
    </div>
  )
}

function EventCard({ title, description, date, location, attendees, category, image }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img
            src={image || "/placeholder.svg?height=200&width=400"}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Badge className="mb-2" variant="secondary">
          {category}
        </Badge>
        <CardTitle className="text-xl">
          <Link href="#" className="hover:text-primary transition-colors">
            {title}
          </Link>
        </CardTitle>
        <CardDescription className="mt-2 line-clamp-2">{description}</CardDescription>
        <div className="mt-4 flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 opacity-70" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 opacity-70" />
            <span>{attendees} attending</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full">Register</Button>
      </CardFooter>
    </Card>
  )
}

function ClubCard({ name, description, members, category, image }) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={image || "/placeholder.svg?height=48&width=48"} alt={name} />
            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{name}</CardTitle>
            <Badge variant="outline" className="mt-1">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 opacity-70" />
          <span>{members} members</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground">
          Join Club
        </Button>
      </CardFooter>
    </Card>
  )
}

