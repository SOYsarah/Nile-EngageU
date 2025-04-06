"use client"

import Link from "next/link"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 mr-2 text-primary"
            >
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span className="text-xl font-bold">Nile Engage U</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link href="/clubs" className="text-sm font-medium hover:text-primary transition-colors">
            Clubs
          </Link>
          <Link href="/my-activities" className="text-sm font-medium hover:text-primary transition-colors">
            My Activities
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <UserAccountNav />
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

