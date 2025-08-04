"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Zone = {
  id: number
  points: number[][]
  createdAt: string
  name: string
  hoursFR: number
  fullPZ: number
  pz35Plus: number
  yellowStatusDate: string
  greenStatusDate: string
  efficiency: number
  color: string
  user: { name: string }
}

export default function ZonesTable() {
  const [zones, setZones] = useState<Zone[]>([])
  const [userFilter, setUserFilter] = useState("all")
  const [colorFilter, setColorFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    fetch("/api/zones")
      .then(res => res.json())
      .then(data => setZones(data))
  }, [])

  const users = Array.from(new Set(zones.map(z => z.user.name)))

  const filteredZones = zones
    .filter(z => userFilter === "all" || z.user.name === userFilter)
    .filter(z => colorFilter === "all" || z.color === colorFilter)
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

  return (
    <div className="p-6 items-center">
      <Link
        href="/admin/zones/"
        className="text-primary te hover:text-blue-800 font-medium mb-4 inline-block"
      >
        Przejdż do widoka reportów
      </Link>
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
          className="border p-2"
        >
          <option value="all">Wszyscy</option>
          {users.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <select
          value={colorFilter}
          onChange={e => setColorFilter(e.target.value)}
          className="border p-2"
        >
          <option value="all">Wszystkie kolory</option>
          <option value="red">Czerwone</option>
          <option value="yellow">Żółte</option>
          <option value="green">Zielone</option>
        </select>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as "newest" | "oldest")}
          className="border p-2"
        >
          <option value="newest">Najnowsze</option>
          <option value="oldest">Najstarsze</option>
        </select>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Nazwa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Godziny
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                PZ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                PZ+35
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Efektywność
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Wysłane przez
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Data utworzenia
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Data żołtego stanu
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Data zielonego stanu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredZones.map(zone => (
              <tr key={zone.id} className="hover:bg-gray-50 transition">
                <th scope="row" className="px-6 py-4 text-gray-900 font-medium">
                  {zone.name}
                </th>
                <td className="px-6 py-4 text-gray-700">{zone.hoursFR}</td>
                <td className="px-6 py-4 text-gray-700">{zone.fullPZ}</td>
                <td className="px-6 py-4 text-gray-700">{zone.pz35Plus}</td>
                <td className="px-6 py-4 text-gray-700">{zone.efficiency}</td>
                <td className="px-6 py-4 text-gray-700">{zone.user.name}</td>
                <td className="px-6 py-4 text-gray-700">{formatDate(zone.createdAt)}</td>
                <td className="px-6 py-4 text-gray-700">{formatDate(zone.yellowStatusDate)}</td>
                <td className="px-6 py-4 text-gray-700">{formatDate(zone.greenStatusDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate().toString().padStart(2, "0")
  const month = (d.getMonth() + 1).toString().padStart(2, "0")
  const year = d.getFullYear()
  const timeHours = d.getHours().toString().padStart(2, "0")
  const timeMinutes = d.getMinutes().toString().padStart(2, "0")
  return `${day}.${month}.${year} ${timeHours}:${timeMinutes}`
}

