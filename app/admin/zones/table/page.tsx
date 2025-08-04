'use client'

import { SessionProvider } from "next-auth/react";
import AdminNavbar from "@/app/components/navbar";
import ZonesTable from "./zonesTable";

export default function ZonesTablePage() {
  return (
    <>
    <AdminNavbar/>
    <SessionProvider>
      <ZonesTable/>
    </SessionProvider>
    </>
  )
}