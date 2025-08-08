import { User } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"
import UserItem from "./UserItem"

export type UsersProps = {
  users: User[]
  setUsers: Dispatch<SetStateAction<User[]>>
}

export default function Users({ users, setUsers }: UsersProps) {
  async function handleDelete(userEmail: string) {
    const res = await fetch(`/api/users?email=${userEmail}`, {
      method: "DELETE",
    })
    if (res.ok) {
      setUsers((prev) => prev.filter((user) => user.email !== userEmail))
    } else {
      alert("Failed to delete user")
    }
  }

  async function handleUpdate(
    originalEmail: string,
    name: string,
    email: string,
    passwordChangeRequest: boolean
  ) {
    const res = await fetch(`/api/users`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalEmail,
        name,
        email,
        passwordChangeRequest,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setUsers((prev) =>
        prev.map((user) =>
          user.email === originalEmail
            ? { ...user, name: data.name, email: data.email }
            : user
        )
      )
      return data.password as string | undefined
    } else {
      alert("Failed to update user")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-6 items-stretch">
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}

