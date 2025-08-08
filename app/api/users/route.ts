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
  try {
    await prisma.user.create({ data: { name, email, password } })
  } catch (e) {
    console.log(e)
    return NextResponse.error()
  }
  return NextResponse.json({ password: passwordPlain })
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { originalEmail, name, email, passwordChangeRequest } = await req.json()

  if (passwordChangeRequest) {
    const passwordPlain = Math.random().toString(36).slice(-8)
    const password = await hash(passwordPlain, 10)

    await prisma.user.update({
      where: {
        email: originalEmail,
      },
      data: {
        email: email,
        password: password,
        name: name,
      },
    })

    return NextResponse.json({ name: name, email: email, password: passwordPlain })
  } else {
    await prisma.user.update({
      where: {
        email: originalEmail,
      },
      data: {
        email: email,
        name: name,
      },
    })
    return NextResponse.json({ name: name, email: email })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  await prisma.user.delete({
    where: {
      email: email
    }
  })

  return NextResponse.json({status: 200})
}
