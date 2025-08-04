import AdminNavbar from "@/app/components/navbar";
import { SessionProvider } from "next-auth/react";
import UsersCreatePage from "./usersCreate";

export default function UserCreatePage() {
  return (
    <>
    <AdminNavbar/>
    <SessionProvider>
      <UsersCreatePage/>
    </SessionProvider>
    </>
  )
}