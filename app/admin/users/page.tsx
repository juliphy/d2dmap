'use client'

import { SessionProvider } from "next-auth/react";

import AdminNavbar from "@/app/components/navbar";
import Link from "next/link";
import Users from "./users";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    async function loadUsers() {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    }
    loadUsers()
  }, [])
  return (
    <>
    <AdminNavbar/>
    <SessionProvider>
      <div className="flex flex-col items-center">
        <Link className="font-medium text-primary" href="/admin/users/create">Chcesz stworzyć konto?</Link>
        <Users users={users} setUsers={setUsers} />
      </div>
    </SessionProvider>
    </>
  )
}