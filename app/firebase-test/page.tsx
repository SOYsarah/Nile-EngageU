"use client"

import { SiteHeader } from "@/components/site-header"
import { FirebaseExample } from "@/components/firebase-example"
import Image from "next/image"

export default function FirebaseTestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <div className="mb-8 flex items-center gap-4">
          <Image src="/images/firebase-logo.png" alt="Firebase Logo" width={60} height={60} className="rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold mb-2">Firebase Test</h1>
            <p className="text-muted-foreground">Test if Firebase is properly initialized and working</p>
          </div>
        </div>

        <div className="max-w-md">
          <FirebaseExample />
        </div>
      </main>
    </div>
  )
}

