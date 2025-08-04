'use client'

import { SessionProvider } from "next-auth/react";
import Zones from "./zones";
import AdminNavbar from "@/app/components/navbar";

export default function ZonesPage() {
  return (
    <>
    <AdminNavbar/>
    <SessionProvider>
      <Zones/>
    </SessionProvider>
    </>
  )
}
