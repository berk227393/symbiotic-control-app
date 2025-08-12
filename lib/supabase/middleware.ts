import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const res = NextResponse.next()

  // Check for mock auth cookie
  const authCookie = request.cookies.get("mock-auth")
  const isAuthenticated = authCookie?.value === "authenticated"

  // Auth routes - redirect to home if already authenticated
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/auth/login") || request.nextUrl.pathname.startsWith("/auth/sign-up")

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Protected routes - redirect to login if not authenticated
  if (!isAuthRoute && !isAuthenticated) {
    const redirectUrl = new URL("/auth/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}
