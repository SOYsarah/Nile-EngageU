import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            Nile EngageU
          </Link>
          <Badge variant="outline">Admin</Badge>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/admin/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <Link href="/admin/events" className="text-sm font-medium">
            Events
          </Link>
          <Link href="/admin/users" className="text-sm font-medium">
            Users
          </Link>
          <Link href="/admin/certificates" className="text-sm font-medium">
            Certificates
          </Link>
          <Link href="/admin/settings" className="text-sm font-medium">
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

