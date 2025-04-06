import { FirebaseReinitialize } from "@/components/setup/firebase-reinitialize"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function FirebaseReinitializePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/setup">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Setup
            </Link>
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <Image src="/images/firebase-logo.png" alt="Firebase Logo" width={60} height={60} className="rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Re-initialize Firebase API</h1>
              <p className="text-muted-foreground">
                Update your Firebase configuration and re-initialize the connection
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <FirebaseReinitialize />
        </div>
      </main>
    </div>
  )
}

