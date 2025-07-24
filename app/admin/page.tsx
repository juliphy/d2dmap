'use client'

import { SessionProvider } from "next-auth/react";
import Admin from "./admin";

export default function AdminPage() {
  return (
    <>
    <SessionProvider>
      <Admin/>
    </SessionProvider>
    </>
  )
}