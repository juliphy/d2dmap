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
    const { points, name, hoursFR, fullPZ, pz35Plus } = data
    if (!points || !Array.isArray(points)) {
      return NextResponse.json({ error: 'Invalid points' }, { status: 400 })
    }
    const efficiency = hoursFR ? (fullPZ + pz35Plus) / hoursFR : 0
    const zone: ZoneRecord = await prisma.zone.create({
      data: {
        points,
        name,
        hoursFR,
        fullPZ,
        pz35Plus,
        efficiency,
        user: { connect: { id: Number(session.user.id) } }
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    })
    return NextResponse.json({ ...zone, color: zoneColor(zone.createdAt) })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const zones = await prisma.zone.findMany({
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  })
  const result = zones.map((z) => ({ ...z, color: zoneColor(z.createdAt) }))
  return NextResponse.json(result)
}