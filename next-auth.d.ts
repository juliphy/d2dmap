declare module "next-auth" {
  interface User {
    id: number
    role: string
  }
  interface Session {
    user: {
      id: number
      name: string
      email?: string
      role: string
    }
  }
}
export {};
