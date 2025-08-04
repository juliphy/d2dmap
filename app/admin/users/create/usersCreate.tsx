'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function UsersCreatePage() {
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  if (!session) {
    return 
  }
  if (session?.user.role !== 'ADMIN') {
    return <div className="p-4">Access denied</div>
  }

  const createUser = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })
    if (res.ok) {
      const data = await res.json()
      setPassword(data.password)
      setName('')
      setEmail('')
    } else {
      alert('Error creating user')
    }
  }

  return (
    <div className="border-1 rounded-lg border-gray-800 pt-6 dark:bg-[#171717] flex flex-col gap-12 pb-6 max-w-sm mx-auto p-4">
      <div className="flex flex-col gap-4 max-w-sm">
        <input className="border border-gray-600 border-[#818181] p-2 rounded" value={name} onChange={e=>setName(e.target.value)} placeholder="Imię" />
        <input className="border border-gray-600 border-[#818181] p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      </div>
      <button className="btn-primary cursor-pointer" onClick={createUser}>Utwórz użytkownika</button>
      {password && <div className="mt-2">Hasło: {password}</div>}
    </div>
  )
}
