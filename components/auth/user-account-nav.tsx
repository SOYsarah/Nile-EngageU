"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User, Bell, Calendar, Shield, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function UserAccountNav() {
  const router = useRouter()
  const { user, signOut, isLoading, isAdmin, sendVerificationEmail } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleSendVerification = async () => {
    if (isSendingVerification) return

    try {
      setIsSendingVerification(true)
      const { error, success } = await sendVerificationEmail()

      if (error) {
        console.error("Error sending verification email:", error)
        return
      }

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and follow the instructions to verify your email.",
      })
    } catch (error) {
      console.error("Error sending verification email:", error)
    } finally {
      setIsSendingVerification(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="h-8 w-8">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Loading</span>
      </Button>
    )
  }

  // Show sign in button if not authenticated
  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    )
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    return user.email ? user.email.substring(0, 2).toUpperCase() : "NU"
  }

  const displayName = user.displayName || user.email || "User"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full" aria-label="User menu">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || "/placeholder.svg?height=32&width=32"} alt={displayName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          {!user.emailVerified && (
            <span
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border-2 border-background"
              aria-hidden="true"
            ></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {!user.emailVerified && (
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs text-amber-500 font-medium">Email not verified</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1 text-xs text-amber-500 hover:text-amber-600"
                  onClick={handleSendVerification}
                  disabled={isSendingVerification}
                >
                  {isSendingVerification ? <Loader2 className="h-3 w-3 animate-spin" /> : "Verify"}
                </Button>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-activities" className="flex items-center cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            <span>My Activities</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/preferences" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="flex items-center cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            {/* Optional notification badge */}
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="cursor-pointer">
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

