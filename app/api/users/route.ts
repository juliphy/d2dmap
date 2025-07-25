import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { name, email } = await req.json()
  if (!name || !email) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }
  const passwordPlain = Math.random().toString(36).slice(-8)
  const password = await hash(passwordPlain, 10)
  await prisma.user.create({ data: { name, email, password } })
  return NextResponse.json({ password: passwordPlain })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}
