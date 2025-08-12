import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Mock authentication için middleware gerekli değil
  // Client-side authentication kullanıyoruz
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
