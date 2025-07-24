'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Admin() {
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!session || session.user.role !== 'ADMIN') {
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
    <div className="flex flex-col gap-2 max-w-sm mx-auto p-4">
      <input className="border p-2 rounded" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input className="border p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <button className="bg-blue-600 text-white p-2 rounded" onClick={createUser}>Create User</button>
      {password && <div>Password: {password}</div>}
    </div>
  )
}
