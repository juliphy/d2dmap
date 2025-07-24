import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin'
  const name = process.env.ADMIN_NAME || 'Admin'

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    console.log(`Admin user already exists with email ${email}`)
    return
  }

  const hashed = await hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'ADMIN',
    },
  })
  console.log(`Admin user created with email ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
