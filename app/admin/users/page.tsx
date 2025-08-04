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
          fetch('/api/users')
              .then(res => res.json())
              .then(data => setUsers(data));
      }, []);
  return (
    <>
    <AdminNavbar/>
    <SessionProvider>
      <div className="flex flex-col items-center">
        <Link className="font-medium text-primary" href="/admin/users/create">Chcesz stworzyć konto?</Link>
        <Users users={users}/>
      </div>
    </SessionProvider>
    </>
  )
}