"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Mock authentication actions
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  if (email === "test@test.com" && password === "test123") {
    const cookieStore = await cookies()
    cookieStore.set("mock-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    redirect("/")
  } else {
    return { error: "Invalid credentials. Use test@test.com / test123" }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  return { error: "Sign up is disabled in mock mode. Use test@test.com / test123 to login." }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("mock-auth")
  redirect("/auth/login")
}
