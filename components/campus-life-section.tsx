import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/image-gallery"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CampusLifeSection() {
  const campusImages = [
    {
      url: "/images/f2.jpg",
      alt: "Students socializing in a modern campus lounge area",
      caption: "Student Center - A place to connect and collaborate",
    },
    {
      url: "/images/f1.jpg",
      alt: "Student on campus outside university building",
      caption: "Campus life at Nile University",
    },
    {
      url: "/images/f3.jpg",
      alt: "Student event in the university auditorium",
      caption: "Student events bring the community together",
    },
    {
      url: "/images/f4.jpg",
      alt: "Students socializing at a campus event",
      caption: "Making connections at campus events",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Campus Life</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the vibrant community and exciting activities at Nile University
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ImageGallery images={campusImages} />
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild className="group">
            <Link href="/events">
              Explore Campus Events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

