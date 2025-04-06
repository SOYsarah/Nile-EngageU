"use client"
import { useState } from "react";
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventCard } from "./event-card"
import { SiteHeader } from "@/components/site-header"
import { ImageGallery } from "@/components/image-gallery"

export default function EventsPage() {
  
export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState("upcoming");
  const [location, setLocation] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(events);

  const handleApplyFilters = () => {
    const now = new Date();
    const filtered = events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || event.category.toLowerCase() === category;
      const matchesLocation = location === "all" || event.location.toLowerCase().includes(location.replace("-", " "));
      
      const eventDate = new Date(event.date);
      let matchesDate = true;

      if (dateRange === "today") {
        matchesDate = eventDate.toDateString() === now.toDateString();
      } else if (dateRange === "this-week") {
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
        matchesDate = eventDate >= now && eventDate <= endOfWeek;
      } else if (dateRange === "this-month") {
        matchesDate = eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      } else if (dateRange === "past") {
        matchesDate = eventDate < now;
      } else {
        matchesDate = eventDate >= now;
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });

    setFilteredEvents(filtered);
  };
  
  const campusImages = [
    {
      url: "/images/f5.jpg",
      alt: "Student event in the university auditorium",
      caption: "Student events bring the community together",
    },
    {
      url: "/images/f6.jpg",
      alt: "Students socializing at a campus event",
      caption: "Making connections at campus events",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Events</h1>
              <p className="text-gray-500 dark:text-gray-400">Discover and participate in campus events</p>
            </div>
            <Button>Create Event</Button>
          </div>

          {/* Featured Event Images */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Featured Event Photos</h2>
            <ImageGallery images={campusImages} />
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row">
            <div className="w-full md:w-1/4">
              <div className="rounded-lg border p-4">
                <h2 className="mb-4 font-semibold">Filters</h2>
                <div className="space-y-4">
                  <div>
                    
                  <label className="mb-2 block text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search for an event..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Event Type</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="past">Past Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Location</label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="main-campus">Main Campus</SelectItem>
                        <SelectItem value="auditorium">Auditorium</SelectItem>
                        <SelectItem value="sports-complex">Sports Complex</SelectItem>
                        <SelectItem value="student-center">Student Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleApplyFilters}>Filter Events</Button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">Showing 12 events</div>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    location={event.location}
                    attendees={event.attendees}
                    category={event.category}
                    spotsAvailable={event.spotsAvailable}
                    userRegistered={event.userRegistered}
                    image={event.image}
                  />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <span className="sr-only">Previous page</span>
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
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Next page</span>
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
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Nile EngageU</h3>
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

const events = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    description: "Join industry leaders and academics to explore the latest in technology innovation.",
    date: "March 15, 2025",
    location: "Main Auditorium",
    attendees: 120,
    category: "Academic",
    spotsAvailable: 30,
    userRegistered: true,
    image:"/images/tech.avif",
      
  },
  {
    id: 2,
    title: "Annual Sports Festival",
    description: "Compete in various sports activities and represent your department.",
    date: "March 20, 2025",
    location: "Sports Complex",
    attendees: 200,
    category: "Sports",
    spotsAvailable: 50,
    userRegistered: false,
    image:"/images/sport.webp",
      
  },
  {
    id: 3,
    title: "Cultural Night",
    description: "Celebrate diversity through music, dance, and food from different cultures.",
    date: "April 5, 2025",
    location: "Student Center",
    attendees: 150,
    category: "Social",
    spotsAvailable: 25,
    userRegistered: false,
    image:"/images/culture2.jpg",
      
  },
  {
    id: 4,
    title: "Career Fair 2025",
    description: "Meet potential employers and explore career opportunities in various industries.",
    date: "April 10, 2025",
    location: "Exhibition Hall",
    attendees: 300,
    category: "Academic",
    spotsAvailable: 0,
    userRegistered: true,
    image:"/images/career.jpg",
      
  },
  {
    id: 5,
    title: "Entrepreneurship Workshop",
    description: "Learn how to turn your ideas into successful business ventures.",
    date: "April 15, 2025",
    location: "Business School",
    attendees: 80,
    category: "Academic",
    spotsAvailable: 20,
    userRegistered: false,
    image:"/images/entrep.jpg",
      
  },
  {
    id: 6,
    title: "Movie Night",
    description: "Relax and enjoy a screening of popular movies with fellow students.",
    date: "April 20, 2025",
    location: "Outdoor Amphitheater",
    attendees: 100,
    category: "Social",
    spotsAvailable: 50,
    userRegistered: false,
    image:"/images/movie.jpeg",
      
  },
  {
    id: 7,
    title: "Research Symposium",
    description: "Showcase your research projects and learn from fellow researchers.",
    date: "April 25, 2025",
    location: "Research Center",
    attendees: 90,
    category: "Academic",
    spotsAvailable: 30,
    userRegistered: false,
    image:"/images/research.jpg",
      
  },
  {
    id: 8,
    title: "Charity Run",
    description: "Participate in a 5K run to raise funds for local charities.",
    date: "May 1, 2025",
    location: "Campus Grounds",
    attendees: 250,
    category: "Sports",
    spotsAvailable: 100,
    userRegistered: false,
    image:"/images/run.webp",
      
  },
  {
    id: 9,
    title: "Art Exhibition",
    description: "Explore creative works by students and faculty members.",
    date: "May 5, 2025",
    location: "Art Gallery",
    attendees: 120,
    category: "Cultural",
    spotsAvailable: 80,
    userRegistered: false,
    image:"/images/art.jpg",
      
  },
]

