import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/auth/sign-in" ||
    path === "/auth/sign-up" ||
    path === "/auth/forgot-password" ||
    path === "/" ||
    path === "/events" ||
    path === "/clubs" ||
    path.startsWith("/api/") ||
    path.startsWith("/_next/") ||
    path.startsWith("/static/") ||
    path.startsWith("/favicon.ico")

  // Define paths that require authentication
  const isProtectedPath = path.startsWith("/profile") || path.startsWith("/admin") || path.startsWith("/my-activities")

  // Get the session cookie
  const sessionCookie = req.cookies.get("__session")?.value

  // If the path requires authentication and there's no session cookie, redirect to sign-in
  if (isProtectedPath && !sessionCookie) {
    // Store the original URL to redirect back after sign-in
    const redirectUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(new URL(`/auth/sign-in?redirect=${redirectUrl}`, req.url))
  }

  // If the user is authenticated and trying to access auth pages, redirect to home
  if (sessionCookie && (path === "/auth/sign-in" || path === "/auth/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    // Protected routes
    "/profile/:path*",
    "/admin/:path*",
    "/my-activities/:path*",

    // Auth routes (for redirecting authenticated users)
    "/auth/:path*",

    // Exclude static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

