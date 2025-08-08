import { User } from "@prisma/client"
import trashIcon from "@/public/trash.svg"
import Image from "next/image"
import { useState } from "react"

type UsersProps = {
    users: User[]
}

export default function Users(props: UsersProps) {
    const [users, setUsers] = useState<User[]>(props.users)

    async function handleDelete(userEmail: string) {
        const res = await fetch(`/api/users?email=${userEmail}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            // Remove user from local state
            setUsers(users.filter(user => user.email !== userEmail))
        } else {
            // handle error (optional)
            alert("Failed to delete user")
        }
    }
    return (
        <div className="flex flex-col items-center gap-4 pt-6 items-stretch">
            {
                props.users.map((user) => (
                    <div key={user.id} className="rounded border-1 border-[#818181] p-5">
                        <h1>Imię: {user.name}</h1>
                        <h2>Email: {user.email}</h2>
                        <Image width={24} height={24} alt="delete user" src={trashIcon} onClick={() => handleDelete(user.email)}/>
                    </div>
                ))
            }
        </div>
    )
}