import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10)

    const user = await prisma.users.upsert({
      where: {
        email: 'test@example.com',
      },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        created_at: new Date(),
      },
    })

    console.log('Created test user:', user)
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
