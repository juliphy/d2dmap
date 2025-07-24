import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface ZoneRecord {
  createdAt: Date
  [key: string]: unknown
}

function zoneColor(createdAt: Date): string {
  const weeks = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 7)
  if (weeks >= 12) return 'green'
  if (weeks >= 6) return 'yellow'
  return 'red'
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await req.json()
    const { points, description } = data
    if (!points || !Array.isArray(points)) {
      return NextResponse.json({ error: 'Invalid points' }, { status: 400 })
    }
    const appendedDesc = `${description} Od: ${session.user?.name ?? ''} ${new Date().toLocaleDateString('pl-PL')}`
    const zone: ZoneRecord = await prisma.zone.create({
      data: { points, description: appendedDesc, user: { connect: { id: Number(session.user.id) } } }
    })
    return NextResponse.json({ ...zone, color: zoneColor(zone.createdAt) })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const zones: ZoneRecord[] = await prisma.zone.findMany()
  const result = zones.map((z: ZoneRecord) => ({ ...z, color: zoneColor(z.createdAt) }))
  return NextResponse.json(result)
}
