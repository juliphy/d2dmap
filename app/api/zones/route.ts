import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Zone } from '@prisma/client'

interface ZoneRecord {
  yellowStatusDate: Date
  greenStatusDate: Date
  [key: string]: unknown
}

function zoneColor(zone: { yellowStatusDate: Date; greenStatusDate: Date }): string {
  const now = new Date()
  if (now >= zone.greenStatusDate) return 'green'
  if (now >= zone.yellowStatusDate) return 'yellow'
  return 'red'
}

function calculateStatusDate(duration: number, unit: 'weeks' | 'months'): Date {
  const date = new Date()
  if (unit === 'weeks') {
    date.setDate(date.getDate() + duration * 7)
  } else {
    date.setMonth(date.getMonth() + duration)
  }
  return date
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await req.json()
    const { points, name, hoursFR, fullPZ, pz35Plus, yellowDuration, yellowUnit, greenDuration, greenUnit } = data
    if (!points || !Array.isArray(points)) {
      return NextResponse.json({ error: 'Invalid points' }, { status: 400 })
    }
    const hoursFRNum = Math.max(0, Number(hoursFR))
    const fullPZNum = Math.max(0, Number(fullPZ))
    const pz35PlusNum = Math.max(0, Number(pz35Plus))
    const yellowDurationNum = Math.max(0, Number(yellowDuration))
    const greenDurationNum = Math.max(0, Number(greenDuration))
    const efficiencyStr = (hoursFRNum ? fullPZNum / hoursFRNum : 0).toFixed(2)
    const efficiency = +efficiencyStr
    const appendedName = `${name}`
    const yellowStatusDate = calculateStatusDate(yellowDurationNum, yellowUnit)
    const greenStatusDate = calculateStatusDate(greenDurationNum, greenUnit)
    const zone: ZoneRecord = await prisma.zone.create({
      data: {
        points,
        name: appendedName,
        hoursFR: hoursFRNum,
        fullPZ: fullPZNum,
        pz35Plus: pz35PlusNum,
        efficiency,
        yellowStatusDate,
        greenStatusDate,
        user: { connect: { id: Number(session.user.id) } }
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })
    return NextResponse.json({ ...zone, color: zoneColor(zone) })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const zones = await prisma.zone.findMany({
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  })
  const result = zones.map((z: Zone) => ({ ...z, color: zoneColor(z) }))
  return NextResponse.json(result)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    await prisma.zone.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
