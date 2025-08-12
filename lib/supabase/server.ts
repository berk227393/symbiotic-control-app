import { cookies } from "next/headers"

// Mock authentication system
export async function createClient() {
  const cookieStore = await cookies()

  return {
    auth: {
      async getUser() {
        const authCookie = cookieStore.get("mock-auth")
        if (authCookie?.value === "authenticated") {
          return {
            data: {
              user: {
                id: "mock-user-id",
                email: "test@test.com",
                created_at: new Date().toISOString(),
              },
            },
            error: null,
          }
        }
        return { data: { user: null }, error: null }
      },
      async getSession() {
        const authCookie = cookieStore.get("mock-auth")
        if (authCookie?.value === "authenticated") {
          return {
            data: {
              session: {
                user: {
                  id: "mock-user-id",
                  email: "test@test.com",
                },
              },
            },
            error: null,
          }
        }
        return { data: { session: null }, error: null }
      },
    },
  }
}

export const isSupabaseConfigured = true
