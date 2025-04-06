import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days

    // In preview mode, use a mock session cookie
    let sessionCookie
    if (process.env.NODE_ENV !== "production") {
      console.log("Using mock session cookie for preview mode")
      sessionCookie = "mock-session-cookie"
    } else {
      sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
    }

    // Set cookie for the session
    cookies().set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE() {
  cookies().delete("__session")
  return NextResponse.json({ status: "success" })
}

