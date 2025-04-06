import { FirebaseSetupGuide } from "@/components/setup/firebase-setup-guide"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function FirebaseSetupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/setup">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Setup
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Firebase Authentication Setup</h1>
          <p className="text-muted-foreground">
            Follow these steps to configure Firebase authentication for your application
          </p>
        </div>

        <FirebaseSetupGuide />
      </main>
    </div>
  )
}

