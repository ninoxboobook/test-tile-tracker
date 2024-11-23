import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // List all users
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        createdAt: true
      }
    })
    console.log('All users:', JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
