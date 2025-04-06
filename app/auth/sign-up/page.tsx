import Link from "next/link"
import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold">
              Nile University Events
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex items-center justify-center py-12">
          <SignUpForm />
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

