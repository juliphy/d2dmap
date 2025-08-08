import { User } from "@prisma/client"
import Image from "next/image"
import trashIcon from "@/public/trash.svg"
import { useState } from "react"

export type UserItemProps = {
  user: User
  onDelete: (email: string) => void
  onUpdate: (
    originalEmail: string,
    name: string,
    email: string,
    passwordChangeRequest: boolean
  ) => Promise<string | undefined>
}

export default function UserItem({ user, onDelete, onUpdate }: UserItemProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState<string | null>(null)

  const save = async () => {
    const newPassword = await onUpdate(user.email, name, email, false)
    if (newPassword) {
      setPassword(newPassword)
    } else {
      setPassword(null)
    }
  }

  const resetPassword = async () => {
    const newPassword = await onUpdate(user.email, name, email, true)
    if (newPassword) {
      setPassword(newPassword)
    }
  }

  return (
    <div className="rounded border-1 border-[#818181] p-5 flex flex-col gap-2">
      <input
        className="border border-[#818181] p-1 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border border-[#818181] p-1 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <button className="btn-primary" onClick={save}>
          Zapisz
        </button>
        <button className="btn-primary" onClick={resetPassword}>
          Resetuj hasło
        </button>
        <Image
          width={24}
          height={24}
          alt="delete user"
          src={trashIcon}
          onClick={() => onDelete(user.email)}
        />
      </div>
      {password && <div className="mt-2">Nowe hasło: {password}</div>}
    </div>
  )
}

