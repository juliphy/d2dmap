'use client'

import { SessionProvider } from "next-auth/react";

import AdminNavbar from "@/app/components/navbar";
import UsersCreatePage from "./usersCreate";

export default function AdminPage() {
  return (
    <>
    <AdminNavbar/>
    <SessionProvider>
      <UsersCreatePage/>
    </SessionProvider>
    </>
  )
}