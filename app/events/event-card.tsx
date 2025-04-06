"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { registerForEvent, cancelEventRegistration } from "@/app/actions/event-actions"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface EventCardProps {
  id: number
  title: string
  description: string
  date: string
  location: string
  attendees: number
  category: string
  image?: string
  spotsAvailable?: number
  userRegistered?: boolean
}

export function EventCard({
  id,
  title,
  description,
  date,
  location,
  attendees,
  category,
  image = "/placeholder.svg?height=200&width=400",
  spotsAvailable,
  userRegistered = false,
}: EventCardProps) {
  const [isRegistered, setIsRegistered] = useState(userRegistered)
  const [spots, setSpots] = useState(spotsAvailable || 50)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { user } = useAuth()

  const handleRegistration = async () => {
    if (!user) {
      router.push(`/auth/sign-in?redirect=/events/${id}`)
      return
    }

    if (!isRegistered && spots > 0) {
      setIsLoading(true)
      try {
        const result = await registerForEvent(id.toString())

        if (result.error) {
          toast({
            title: "Registration failed",
            description: result.error,
            variant: "destructive",
          })
          return
        }

        setIsRegistered(true)
        setSpots(spots - 1)
        toast({
          title: "Registration successful",
          description: "You have successfully registered for this event.",
        })
      } catch (error) {
        console.error("Error registering for event:", error)
        toast({
          title: "Registration failed",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancelRegistration = async () => {
    setIsLoading(true)
    try {
      const result = await cancelEventRegistration(id.toString())

      if (result.error) {
        toast({
          title: "Cancellation failed",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setIsRegistered(false)
      setSpots(spots + 1)
      toast({
        title: "Registration cancelled",
        description: "Your registration has been cancelled.",
      })
    } catch (error) {
      console.error("Error cancelling registration:", error)
      toast({
        title: "Cancellation failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Badge className="mb-2">{category}</Badge>
        <CardTitle className="text-xl">
          <Link href={`/events/${id}`} className="hover:underline">
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
            <span>
              {attendees} attending {spots > 0 && <span className="text-muted-foreground">• {spots} spots left</span>}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {isRegistered ? (
          <div className="flex w-full gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
              Registered
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleCancelRegistration} disabled={isLoading}>
              {isLoading ? "Processing..." : "Cancel"}
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={handleRegistration} disabled={spots === 0 || isLoading}>
            {isLoading ? "Processing..." : spots > 0 ? "Register" : "Event Full"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

