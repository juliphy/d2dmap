import { User } from "@prisma/client"

type UsersProps = {
    users: User[]
}

export default function Users(props: UsersProps) {
    return (
        <div className="flex flex-col items-center gap-4 pt-6 items-stretch">
            {
                props.users.map((user) => (
                    <div key={user.id} className="rounded border-1 border-[#818181] p-5">
                        <h1>Imię: {user.name}</h1>
                        <h2>Email: {user.email}</h2>
                    </div>
                ))
            }
        </div>
    )
}