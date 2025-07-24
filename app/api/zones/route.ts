import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { points, description } = data
    if (!points || !Array.isArray(points)) {
      return NextResponse.json({ error: 'Invalid points' }, { status: 400 })
    }
    const zone = await prisma.zone.create({
      data: { points, description }
    })
    return NextResponse.json(zone)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const zones = await prisma.zone.findMany()
  return NextResponse.json(zones)
}
